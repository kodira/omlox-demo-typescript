import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OmloxBaseService } from '../base.service';
import { Zone } from '../models';

@Injectable({
    providedIn: 'root',
})
export class OmloxZonesService extends OmloxBaseService {
    /**
     * Get an array of all zones.
     * Returns an array of all zone objects. If authorization is enabled only the corresponding zones are returned.
     */
    getAllZones(): Observable<Zone[]> {
        return this.get<Zone[]>('/zones/summary');
    }

    /**
     * Get a zone.
     * Returns the zone object with the given id.
     */
    getZone(zoneId: string): Observable<Zone> {
        return this.get<Zone>(`/zones/${zoneId}`);
    }

    /**
     * Create a zone.
     * Creates a new zone and returns the created object. The provided id will be replaced by a generated uuid.
     */
    createZone(
        zone: Zone,
        options?: {
            subdivide?: boolean;
        }
    ): Observable<Zone> {
        let params = new HttpParams();
        if (options?.subdivide !== undefined) {
            params = params.set('subdivide', options.subdivide.toString());
        }

        return this.post<Zone>('/zones', zone);
    }

    /**
     * Update a zone.
     * Updates the zone object with the given id.
     */
    updateZone(
        zoneId: string,
        zone: Zone,
        options?: {
            subdivide?: boolean;
        }
    ): Observable<Zone> {
        let params = new HttpParams();
        if (options?.subdivide !== undefined) {
            params = params.set('subdivide', options.subdivide.toString());
        }

        return this.put<Zone>(`/zones/${zoneId}`, zone);
    }

    /**
     * Delete a zone.
     * Deletes the zone object with the given id.
     */
    deleteZone(zoneId: string): Observable<void> {
        return this.delete<void>(`/zones/${zoneId}`);
    }

    /**
     * Delete all zones.
     * This function deletes all zones known to the system.
     */
    deleteAllZones(): Observable<void> {
        return this.delete<void>('/zones');
    }

    /**
     * Get all trackables within a zone.
     * Returns trackables which have a location that is currently considered as being inside the given zone.
     */
    getInsideTrackablesForZone(
        zoneId: string,
        spatialQuery?: boolean
    ): Observable<import('../models/trackable').Trackable[]> {
        let params = new HttpParams();
        if (spatialQuery !== undefined) {
            params = params.set('spatial_query', spatialQuery.toString());
        }

        return this.get<import('../models/trackable').Trackable[]>(
            `/zones/${zoneId}/trackables`,
            params
        );
    }
}
