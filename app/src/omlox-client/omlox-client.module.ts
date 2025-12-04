import { NgModule, ModuleWithProviders } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { OmloxClientConfig, OMLOX_CLIENT_CONFIG } from './config';
import { OmloxBaseService } from './base.service';
import {
    OmloxTrackablesService,
    OmloxFencesService,
    OmloxZonesService,
    OmloxProvidersService,
} from './services';

/**
 * @deprecated Use `provideOmloxClient()` function instead for standalone Angular applications.
 * This module is provided for backward compatibility only.
 * 
 * Migration example:
 * ```typescript
 * // Old module-based approach:
 * imports: [OmloxClientModule.forRoot(config)]
 * 
 * // New standalone approach:
 * providers: [provideOmloxClient(config)]
 * ```
 */
@NgModule({
    imports: [HttpClientModule],
    providers: [
        OmloxBaseService,
        OmloxTrackablesService,
        OmloxFencesService,
        OmloxZonesService,
        OmloxProvidersService,
    ],
})
export class OmloxClientModule {
    /**
     * @deprecated Use `provideOmloxClient(config)` instead.
     * This method is provided for backward compatibility only.
     */
    static forRoot(config: OmloxClientConfig): ModuleWithProviders<OmloxClientModule> {
        return {
            ngModule: OmloxClientModule,
            providers: [
                { provide: OMLOX_CLIENT_CONFIG, useValue: config },
                OmloxBaseService,
                OmloxTrackablesService,
                OmloxFencesService,
                OmloxZonesService,
                OmloxProvidersService,
            ],
        };
    }
}
