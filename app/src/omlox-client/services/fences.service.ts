import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OmloxBaseService } from '../base.service';
import { Fence, FenceEvent, Collision, CollisionEvent } from '../models';

@Injectable({
    providedIn: 'root',
})
export class OmloxFencesService extends OmloxBaseService {
    /**
     * Get an array of all fences.
     * Returns an array of all fence objects. If authorization is enabled only the corresponding fences are returned.
     */
    getAllFences(): Observable<Fence[]> {
        return this.get<Fence[]>('/fences/summary');
    }

    /**
     * Get a fence.
     * Returns the fence object with the given id.
     */
    getFence(fenceId: string): Observable<Fence> {
        return this.get<Fence>(`/fences/${fenceId}`);
    }

    /**
     * Create a fence.
     * Creates a new fence and returns the created object.
     */
    createFence(
        fence: Fence,
        options?: {
            forceLocationUpdate?: boolean;
            subdivide?: boolean;
        }
    ): Observable<Fence> {
        let params = new HttpParams();
        if (options?.forceLocationUpdate !== undefined) {
            params = params.set('force_location_update', options.forceLocationUpdate.toString());
        }
        if (options?.subdivide !== undefined) {
            params = params.set('subdivide', options.subdivide.toString());
        }

        return this.post<Fence>('/fences', fence);
    }

    /**
     * Update a fence.
     * Updates the fence object with the given id.
     */
    updateFence(
        fenceId: string,
        fence: Fence,
        options?: {
            forceLocationUpdate?: boolean;
            subdivide?: boolean;
        }
    ): Observable<Fence> {
        let params = new HttpParams();
        if (options?.forceLocationUpdate !== undefined) {
            params = params.set('force_location_update', options.forceLocationUpdate.toString());
        }
        if (options?.subdivide !== undefined) {
            params = params.set('subdivide', options.subdivide.toString());
        }

        return this.put<Fence>(`/fences/${fenceId}`, fence);
    }

    /**
     * Delete a fence.
     * Deletes the fence object with the given id.
     */
    deleteFence(fenceId: string): Observable<void> {
        return this.delete<void>(`/fences/${fenceId}`);
    }

    /**
     * Delete all fences.
     * This function deletes all fences known to the system.
     */
    deleteAllFences(): Observable<void> {
        return this.delete<void>('/fences');
    }

    /**
     * Get fence events.
     * Returns fence events for the specified fence, including entry and exit events.
     */
    getFenceEvents(
        fenceId: string,
        options?: {
            maxAge?: number;
            limit?: number;
            offset?: number;
            trackableId?: string;
        }
    ): Observable<FenceEvent[]> {
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
        if (options?.trackableId) {
            params = params.set('trackable_id', options.trackableId);
        }

        return this.get<FenceEvent[]>(`/fences/${fenceId}/events`, params);
    }

    /**
     * Get all trackables within a fence.
     * Returns trackables which have a location that is currently considered as being inside the given fence, e.g., for which a region entry fence event was triggered.
     */
    getInsideTrackablesForFence(
        fenceId: string,
        spatialQuery?: boolean
    ): Observable<import('../models/trackable').Trackable[]> {
        let params = new HttpParams();
        if (spatialQuery !== undefined) {
            params = params.set('spatial_query', spatialQuery.toString());
        }

        return this.get<import('../models/trackable').Trackable[]>(
            `/fences/${fenceId}/trackables`,
            params
        );
    }

    /**
     * Get all collisions.
     * Returns collision data for trackable objects.
     */
    getAllCollisions(options?: {
        maxAge?: number;
        limit?: number;
        offset?: number;
        trackableId?: string;
    }): Observable<Collision[]> {
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
        if (options?.trackableId) {
            params = params.set('trackable_id', options.trackableId);
        }

        return this.get<Collision[]>('/collisions', params);
    }

    /**
     * Get all collision events.
     * Returns collision events including start, ongoing, and end events between trackables.
     */
    getAllCollisionEvents(options?: {
        maxAge?: number;
        limit?: number;
        offset?: number;
        trackableId?: string;
    }): Observable<CollisionEvent[]> {
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
        if (options?.trackableId) {
            params = params.set('trackable_id', options.trackableId);
        }

        return this.get<CollisionEvent[]>('/collision-events', params);
    }
}
