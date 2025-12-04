import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { OAuthService } from './oauth.service';
import {
    OmloxTrackablesService,
    OmloxFencesService,
    OmloxBaseService,
    Trackable,
    Fence,
    Location,
    TrackableMotion,
} from '../omlox-client';

/**
 * High-level service that wraps OMLOX API calls with automatic authentication.
 * This service handles OAuth token management and ensures all API calls are properly authenticated.
 * It provides a simplified interface over the raw OMLOX client services.
 */
@Injectable({
    providedIn: 'root',
})
export class OmloxService {
    constructor(
        private oauthService: OAuthService,
        private baseService: OmloxBaseService,
        private trackablesService: OmloxTrackablesService,
        private fencesService: OmloxFencesService
    ) {}

    /**
     * Ensures authentication before making API calls.
     * Sets the Bearer token on all service instances and then executes the API call.
     */
    private ensureAuthenticated<T>(apiCall: () => Observable<T>): Observable<T> {
        return this.oauthService.getToken().pipe(
            switchMap((token) => {
                // Set token on all service instances
                this.baseService.setBearerToken(token);
                this.trackablesService.setBearerToken(token);
                this.fencesService.setBearerToken(token);
                return apiCall();
            })
        );
    }

    // Trackables API
    /** Get all trackables in the system */
    getAllTrackables(): Observable<Trackable[]> {
        return this.ensureAuthenticated(() => this.trackablesService.getAllTrackables());
    }

    /** Get a specific trackable by ID */
    getTrackable(trackableId: string): Observable<Trackable> {
        return this.ensureAuthenticated(() => 
            this.trackablesService.getTrackable(trackableId)
        );
    }

    /** Get location history for a specific trackable */
    getTrackableLocation(trackableId: string): Observable<Location[]> {
        return this.ensureAuthenticated(() => 
            this.trackablesService.getAllTrackableLocations(trackableId)
        );
    }

    /** Get current motion data for a specific trackable */
    getTrackableMotion(trackableId: string): Observable<TrackableMotion> {
        return this.ensureAuthenticated(() => 
            this.trackablesService.getTrackableMotion(trackableId)
        );
    }

    /** Get all fences that contain a specific trackable */
    getTrackableFences(trackableId: string, spatialQuery?: boolean): Observable<Fence[]> {
        return this.ensureAuthenticated(() => 
            this.trackablesService.getInsideFenceForTrackable(trackableId, spatialQuery)
        );
    }

    // Fences API
    /** Get all fences in the system */
    getAllFences(): Observable<Fence[]> {
        return this.ensureAuthenticated(() => this.fencesService.getAllFences());
    }

    /** Get a specific fence by ID */
    getFence(fenceId: string): Observable<Fence> {
        return this.ensureAuthenticated(() => this.fencesService.getFence(fenceId));
    }

}
