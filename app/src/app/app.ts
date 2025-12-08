import { Component, OnInit, signal, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { interval, Subscription } from 'rxjs';
import * as L from 'leaflet';
import { Fence, Trackable, Location } from '@kodira/omlox-client-typescript-angular';
import { OmloxService } from './omlox.service';

// Fix for Leaflet marker icons in bundled applications
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

@Component({
    selector: 'app-root',
    imports: [CommonModule],
    templateUrl: './app.html',
    styleUrl: './app.css',
})
export class App implements OnInit, OnDestroy {
    protected readonly title = signal('Intrusion Alarm System');
    protected readonly trackables = signal<Trackable[]>([]);
    protected readonly fences = signal<Fence[]>([]);
    protected readonly selectedTrackableIds = signal<Set<string>>(new Set());
    protected readonly armedFenceIds = signal<Set<string>>(new Set());
    protected readonly loading = signal(false);
    protected readonly error = signal<string | null>(null);
    protected readonly alarm = signal(false);
    protected readonly isTracking = signal(false);

    private map?: L.Map;
    private trackableMarkers = new Map<string, L.Marker>();
    private fenceLayer?: L.LayerGroup;
    private trackingSubscription?: Subscription;
    private trackablesInArmedFences = new Set<string>();

    private omloxService = inject(OmloxService);

    constructor() {}

    ngOnInit() {
        this.loadFences();
        this.loadTrackables();
        setTimeout(() => this.initMap(), 100);
    }

    private loadFences() {
        this.loading.set(true);
        this.omloxService.getAllFences().subscribe({
            next: (fences) => {
                this.fences.set(fences);

                this.drawFencesOnMap();

                // Auto-center on fences after a short delay to ensure map is ready
                setTimeout(() => {
                    this.centerMapOnData();
                    // Force map invalidation to fix re-drawing issues
                    if (this.map) {
                        setTimeout(() => {
                            this.map!.invalidateSize();
                        }, 100);
                    }
                }, 500);

                this.loading.set(false);
            },
            error: (err) => {
                console.error('Error loading fences:', err);
                this.error.set('Failed to load fences: ' + err.message);
                this.loading.set(false);
            },
        });
    }

    private loadTrackables() {
        this.loading.set(true);
        this.omloxService.getAllTrackables().subscribe({
            next: (trackables) => {
                this.trackables.set(trackables);
                this.loading.set(false);
            },
            error: (err) => {
                console.error('Error loading trackables:', err);
                this.error.set('Failed to load trackables: ' + err.message);
                this.loading.set(false);
            },
        });
    }

    private initMap() {
        this.map = L.map('map').setView([49.0134, 8.4042], 16); // Karlsruhe coordinates as default

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
        }).addTo(this.map);

        this.fenceLayer = L.layerGroup().addTo(this.map);

        // Set up event handlers to ensure proper map rendering
        this.map.on('ready', () => {
            setTimeout(() => {
                if (this.map) {
                    this.map.invalidateSize();
                }
            }, 100);
        });

        this.map.on('resize', () => {
            setTimeout(() => {
                if (this.map) {
                    this.map.invalidateSize();
                }
            }, 50);
        });
    }

    private drawFencesOnMap() {
        if (!this.map || !this.fenceLayer) return;

        this.fenceLayer.clearLayers();
        const allLatLngs: L.LatLng[] = [];

        this.fences().forEach((fence) => {
            if (fence.region?.coordinates && fence.region.coordinates.length > 0) {
                try {
                    // Handle different coordinate formats
                    let coords = fence.region.coordinates;
                    if (
                        (fence.region.type as unknown as string) === 'Polygon' &&
                        coords &&
                        coords[0] &&
                        Array.isArray(coords[0])
                    ) {
                        // Polygon format: [[[lat, lng], ...]]
                        coords = coords[0] as any;
                    }

                    const latLngs =
                        (coords?.map((coord: any) => {
                            // API format: [longitude, latitude, elevation]
                            // Leaflet expects: L.latLng(latitude, longitude)
                            const lon = coord[0];
                            const lat = coord[1];
                            const latLng = L.latLng(lat, lon);
                            allLatLngs.push(latLng);
                            return latLng;
                        }) as L.LatLngExpression[]) || [];

                    const isArmed = this.armedFenceIds().has(fence.id!);
                    const color = isArmed ? '#ff4444' : '#3388ff';

                    const polygon = L.polygon(latLngs, {
                        color: color,
                        weight: 2,
                        fillOpacity: 0.2,
                    }).addTo(this.fenceLayer!);

                    polygon.bindPopup(
                        `<strong>${fence.name || fence.id}</strong><br>Region: ${
                            fence.region?.type || 'Unknown'
                        }`
                    );
                } catch (error) {
                    console.error('Error drawing fence:', fence.id, error);
                }
            }
        });

        // Auto-fit map to show all fences
        if (allLatLngs.length > 0) {
            const group = L.featureGroup(this.fenceLayer.getLayers() as L.Layer[]);
            this.map.fitBounds(group.getBounds(), { padding: [20, 20] });
        }
    }

    toggleTrackable(trackableId: string) {
        const selected = new Set(this.selectedTrackableIds());
        if (selected.has(trackableId)) {
            selected.delete(trackableId);
            // Remove from intrusion tracking when deselected
            this.trackablesInArmedFences.delete(trackableId);
            // Update alarm state
            this.updateAlarmState();
        } else {
            selected.add(trackableId);
        }
        this.selectedTrackableIds.set(selected);
    }

    isSelected(trackableId: string): boolean {
        return this.selectedTrackableIds().has(trackableId);
    }

    get trackablesInFencesCount(): number {
        return this.trackablesInArmedFences.size;
    }

    toggleFenceArmed(fenceId: string) {
        const armed = new Set(this.armedFenceIds());
        if (armed.has(fenceId)) {
            armed.delete(fenceId);
        } else {
            armed.add(fenceId);
        }
        this.armedFenceIds.set(armed);
        // Redraw fences to update colors
        this.drawFencesOnMap();
    }

    isFenceArmed(fenceId: string): boolean {
        return this.armedFenceIds().has(fenceId);
    }

    startTracking() {
        if (this.selectedTrackableIds().size === 0) {
            this.error.set('Please select at least one trackable to monitor');
            return;
        }

        this.isTracking.set(true);
        this.error.set(null);

        // Poll every 5 seconds for location updates
        this.trackingSubscription = interval(5000).subscribe({
            next: () => {
                this.updateTrackableLocations();
            },
            error: (err) => {
                console.error('Error during tracking:', err);
                this.error.set('Tracking error: ' + err.message);
                this.stopTracking();
            },
        });

        // Initial update
        this.updateTrackableLocations();
    }

    stopTracking() {
        this.isTracking.set(false);
        this.trackingSubscription?.unsubscribe();
        this.trackingSubscription = undefined;

        // Clear markers
        this.trackableMarkers.clear();
        if (this.map) {
            this.map.eachLayer((layer) => {
                if (layer instanceof L.Marker) {
                    this.map!.removeLayer(layer);
                }
            });
        }

        // Clear intrusion tracking and alarm
        this.trackablesInArmedFences.clear();
        this.alarm.set(false);
    }

    private updateTrackableLocations() {
        const selectedIds = Array.from(this.selectedTrackableIds());
        const locationRequests = selectedIds.map((id) =>
            this.omloxService.getTrackableLocation(id)
        );

        return new Promise<void>((resolve) => {
            let completed = 0;

            locationRequests.forEach((request, index) => {
                const trackableId = selectedIds[index];

                request.subscribe({
                    next: (locations) => {
                        if (locations && locations.length > 0) {
                            const location = locations[0]; // Use most recent location
                            this.updateTrackableMarker(trackableId, location);
                            this.checkGeofenceViolation(trackableId, location);
                        }

                        completed++;
                        if (completed === locationRequests.length) {
                            resolve();
                        }
                    },
                    error: (err) => {
                        console.error(`Error fetching location for ${trackableId}:`, err);
                        completed++;
                        if (completed === locationRequests.length) {
                            resolve();
                        }
                    },
                });
            });

            if (locationRequests.length === 0) {
                resolve();
            }
        });
    }

    private updateTrackableMarker(trackableId: string, location: Location) {
        if (!this.map) {
            console.warn('updateTrackableMarker() -> No map');
            return;
        }

        if (!location.position?.coordinates) {
            console.warn('updateTrackableMarker() -> No coordinates');
            return;
        }

        if (location.position.coordinates.length < 2) {
            console.warn('updateTrackableMarker() -> Not enough coordinates');
        }

        const [lng, lat] = location.position.coordinates;
        const latLng: L.LatLngExpression = [lat, lng];

        // Remove existing marker if any
        const existingMarker = this.trackableMarkers.get(trackableId);
        if (existingMarker) {
            this.map.removeLayer(existingMarker);
        }

        // Add new marker
        const marker = L.marker(latLng).addTo(this.map);
        const trackable = this.trackables().find((t) => t.id === trackableId);
        marker.bindPopup(
            `<strong>${
                trackable?.name || trackableId
            }</strong><br>Last updated: ${new Date().toLocaleTimeString()}`
        );

        this.trackableMarkers.set(trackableId, marker);
    }

    private checkGeofenceViolation(trackableId: string, location: Location) {
        if (!location.position?.coordinates || location.position.coordinates.length < 2) return;

        this.omloxService.getTrackableFences(trackableId, true).subscribe({
            next: (fences: Fence[]) => {
                // Check if trackable is inside any ARMED fences
                const insideArmedFences = fences.filter((fence: Fence) =>
                    this.armedFenceIds().has(fence.id!)
                );
                const insideArmedFence = insideArmedFences.length > 0;

                // Update tracking of which trackables are inside armed fences
                if (insideArmedFence) {
                    if (!this.trackablesInArmedFences.has(trackableId)) {
                        this.trackablesInArmedFences.add(trackableId);
                        console.warn(
                            `INTRUSION DETECTED! Trackable ${trackableId} entered ${insideArmedFences.length} armed fence(s)`
                        );
                    }
                } else {
                    if (this.trackablesInArmedFences.has(trackableId)) {
                        this.trackablesInArmedFences.delete(trackableId);
                    }
                }

                // Update alarm state based on current violations
                this.updateAlarmState();
            },
            error: (error: any) => {
                console.error('Error checking fence containment:', error);
            },
        });
    }

    private updateAlarmState() {
        const shouldShowAlarm = this.trackablesInArmedFences.size > 0;

        if (shouldShowAlarm !== this.alarm()) {
            this.alarm.set(shouldShowAlarm);

            if (shouldShowAlarm) {
                console.warn(
                    `INTRUSION ALARM ACTIVATED! ${this.trackablesInArmedFences.size} trackable(s) inside armed fence(s)`
                );
            }
        }
    }

    centerMapOnData() {
        if (!this.map) {
            console.warn('Map not initialized');
            return;
        }

        const allBounds: L.LatLng[] = [];

        // Collect fence coordinates
        this.fences().forEach((fence) => {
            if (fence.region?.coordinates) {
                try {
                    let coordinates = fence.region.coordinates;
                    if (
                        fence.region.type === 'Polygon' &&
                        coordinates &&
                        coordinates[0] &&
                        Array.isArray(coordinates[0])
                    ) {
                        coordinates = coordinates[0] as any;
                    }
                    coordinates?.forEach((coord: any) => {
                        // API format: [longitude, latitude, elevation]
                        // Leaflet expects: L.latLng(latitude, longitude)
                        const lon = coord[0];
                        const lat = coord[1];
                        const latLng = L.latLng(lat, lon);
                        allBounds.push(latLng);
                    });
                } catch (error) {
                    console.error('Error processing fence coordinates:', error);
                }
            }
        });

        // Collect trackable marker positions if any
        this.trackableMarkers.forEach((marker) => {
            allBounds.push(marker.getLatLng());
        });

        if (allBounds.length > 0) {
            const bounds = L.latLngBounds(allBounds);
            this.map.fitBounds(bounds, { padding: [50, 50] });

            // Force map invalidation to fix rendering issues
            setTimeout(() => {
                if (this.map) {
                    this.map.invalidateSize();
                }
            }, 200);
        } else {
            console.warn('No data to center on');
        }
    }

    ngOnDestroy() {
        this.stopTracking();
    }
}
