import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OmloxBaseService } from '../base.service';
import { LocationProvider } from '../models';

@Injectable({
    providedIn: 'root',
})
export class OmloxProvidersService extends OmloxBaseService {
    /**
     * Get an array of all location providers.
     * Returns an array of all location provider objects. If authorization is enabled only the corresponding providers are returned.
     */
    getAllProviders(): Observable<LocationProvider[]> {
        return this.get<LocationProvider[]>('/providers/summary');
    }

    /**
     * Get a location provider.
     * Returns the location provider object with the given id.
     */
    getProvider(providerId: string): Observable<LocationProvider> {
        return this.get<LocationProvider>(`/providers/${providerId}`);
    }

    /**
     * Create a location provider.
     * Creates a new location provider and returns the created object.
     */
    createProvider(provider: LocationProvider): Observable<LocationProvider> {
        return this.post<LocationProvider>('/providers', provider);
    }

    /**
     * Update a location provider.
     * Updates the location provider object with the given id.
     */
    updateProvider(providerId: string, provider: LocationProvider): Observable<LocationProvider> {
        return this.put<LocationProvider>(`/providers/${providerId}`, provider);
    }

    /**
     * Delete location provider.
     * Deletes the location provider object with the given id.
     */
    deleteProvider(providerId: string): Observable<void> {
        return this.delete<void>(`/providers/${providerId}`);
    }

    /**
     * Delete all location providers.
     * This function deletes all location providers known to the system.
     */
    deleteAllProviders(): Observable<void> {
        return this.delete<void>('/providers');
    }

    /**
     * Get sensors for a location provider.
     * Returns sensor data associated with the specified location provider.
     */
    getProviderSensors(providerId: string): Observable<any[]> {
        return this.get<any[]>(`/providers/${providerId}/sensors`);
    }
}
