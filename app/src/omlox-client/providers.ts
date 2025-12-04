import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { OmloxClientConfig, OMLOX_CLIENT_CONFIG } from './config';
import { OmloxBaseService } from './base.service';
import {
    OmloxTrackablesService,
    OmloxFencesService,
    OmloxZonesService,
    OmloxProvidersService,
} from './services';

/**
 * Provides OMLOX client services for standalone Angular applications.
 * Use this function in your bootstrap providers or route providers to configure the OMLOX client.
 * 
 * @param config Configuration object containing baseUrl and optional default headers
 * @returns Environment providers for the OMLOX client services
 * 
 * @example
 * ```typescript
 * // In main.ts
 * bootstrapApplication(AppComponent, {
 *   providers: [
 *     provideOmloxClient({
 *       baseUrl: 'https://api.example.com',
 *       defaultHeaders: { 'X-API-Version': '2.0' }
 *     })
 *   ]
 * });
 * ```
 */
export function provideOmloxClient(config: OmloxClientConfig): EnvironmentProviders {
    return makeEnvironmentProviders([
        provideHttpClient(),
        { provide: OMLOX_CLIENT_CONFIG, useValue: config },
        OmloxBaseService,
        OmloxTrackablesService,
        OmloxFencesService,
        OmloxZonesService,
        OmloxProvidersService,
    ]);
}

/**
 * Provides OMLOX client services without configuration.
 * Use this when you want to provide the services but configure them later,
 * or when configuration is provided through other means.
 * 
 * @returns Environment providers for the OMLOX client services
 * 
 * @example
 * ```typescript
 * // In a feature route
 * export const routes: Routes = [
 *   {
 *     path: 'dashboard',
 *     providers: [provideOmloxServices()],
 *     loadComponent: () => import('./dashboard.component').then(m => m.DashboardComponent)
 *   }
 * ];
 * ```
 */
export function provideOmloxServices(): EnvironmentProviders {
    return makeEnvironmentProviders([
        provideHttpClient(),
        OmloxBaseService,
        OmloxTrackablesService,
        OmloxFencesService,
        OmloxZonesService,
        OmloxProvidersService,
    ]);
}