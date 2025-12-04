import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OmloxBaseService } from '../base.service';
import { Trackable, TrackableMotion, Location, LocationProvider } from '../models';

@Injectable({
    providedIn: 'root',
})
export class OmloxTrackablesService extends OmloxBaseService {
    /**
     * Get an array of all trackables.
     * Returns an array of all trackable objects. If authorization is enabled only the corresponding trackables are returned.
     */
    getAllTrackables(): Observable<Trackable[]> {
        return this.get<Trackable[]>('/trackables/summary');
    }

    /**
     * Get a trackable.
     * Returns the trackable object with the given id.
     */
    getTrackable(trackableId: string): Observable<Trackable> {
        return this.get<Trackable>(`/trackables/${trackableId}`);
    }

    /**
     * Create a trackable.
     * Creates a new trackable with a randomly generated id.
     */
    createTrackable(
        trackable: Trackable,
        options?: {
            forceLocationUpdate?: boolean;
            subdivide?: boolean;
        }
    ): Observable<Trackable> {
        let params = new HttpParams();
        if (options?.forceLocationUpdate !== undefined) {
            params = params.set('force_location_update', options.forceLocationUpdate.toString());
        }
        if (options?.subdivide !== undefined) {
            params = params.set('subdivide', options.subdivide.toString());
        }

        return this.post<Trackable>('/trackables', trackable);
    }

    /**
     * Updates a trackable.
     * Updates the trackable object with the given id.
     */
    updateTrackable(
        trackableId: string,
        trackable: Trackable,
        options?: {
            forceLocationUpdate?: boolean;
            subdivide?: boolean;
        }
    ): Observable<Trackable> {
        let params = new HttpParams();
        if (options?.forceLocationUpdate !== undefined) {
            params = params.set('force_location_update', options.forceLocationUpdate.toString());
        }
        if (options?.subdivide !== undefined) {
            params = params.set('subdivide', options.subdivide.toString());
        }

        return this.put<Trackable>(`/trackables/${trackableId}`, trackable);
    }

    /**
     * Delete a trackable.
     * Deletes the trackable object with the given id.
     */
    deleteTrackable(trackableId: string): Observable<void> {
        return this.delete<void>(`/trackables/${trackableId}`);
    }

    /**
     * Delete all trackables.
     * This function deletes all trackables known to the system.
     */
    deleteAllTrackables(): Observable<void> {
        return this.delete<void>('/trackables');
    }

    /**
     * Get a motion.
     * Returns the motion object for the trackable with the given id.
     */
    getTrackableMotion(trackableId: string): Observable<TrackableMotion> {
        return this.get<TrackableMotion>(`/trackables/${trackableId}/motion`);
    }

    /**
     * Get all locations.
     * Returns the last known location of the trackable with the given id for all of its location providers.
     */
    getAllTrackableLocations(
        trackableId: string,
        options?: {
            maxAge?: number;
            limit?: number;
            offset?: number;
        }
    ): Observable<Location[]> {
        let params = new HttpParams();
        if (options?.maxAge !== undefined) {
            params = params.set('max_age', options.maxAge.toString());
        }
        if (options?.limit !== undefined) {
            params = params.set('limit', options.limit.toString());
        }
        if (options?.offset !== undefined) {
            params = params.set('offset', options.offset.toString());
        }

        return this.get<Location[]>(`/trackables/${trackableId}/locations`, params);
    }

    /**
     * Update location.
     * This method updates the current location of the location provider with the given id.
     */
    createTrackableLocation(trackableId: string, location: Location): Observable<Location> {
        return this.post<Location>(`/trackables/${trackableId}/locations`, location);
    }

    /**
     * Get location providers of a trackable
     * Retrieve a list of location provider IDs associated with a specific trackable.
     */
    getTrackableLocationProviders(trackableId: string): Observable<LocationProvider[]> {
        return this.get<LocationProvider[]>(`/trackables/${trackableId}/location_providers`);
    }

    /**
     * Assign location provider to trackable.
     * Associates a location provider with a specific trackable.
     */
    assignLocationProvider(trackableId: string, locationProviderId: string): Observable<void> {
        return this.put<void>(
            `/trackables/${trackableId}/location_providers/${locationProviderId}`,
            {}
        );
    }

    /**
     * Unassign location provider from trackable.
     * Removes the association between a location provider and a specific trackable.
     */
    unassignLocationProvider(trackableId: string, locationProviderId: string): Observable<void> {
        return this.delete<void>(
            `/trackables/${trackableId}/location_providers/${locationProviderId}`
        );
    }

    /**
     * Get all fences the trackable is within.
     * Returns all fences for which the trackable is currently considered as being inside the respective fence, e.g., for which a region entry fence event was triggered.
     */
    getInsideFenceForTrackable(
        trackableId: string,
        spatialQuery?: boolean
    ): Observable<import('../models/fence').Fence[]> {
        let params = new HttpParams();
        if (spatialQuery !== undefined) {
            params = params.set('spatial_query', spatialQuery.toString());
        }

        return this.get<import('../models/fence').Fence[]>(
            `/trackables/${trackableId}/fences`,
            params
        );
    }

    /**
     * Get all sensors for a trackable.
     * Returns sensor data associated with the specified trackable.
     */
    getAllTrackableSensors(trackableId: string): Observable<any[]> {
        return this.get<any[]>(`/trackables/${trackableId}/sensors`);
    }
}
