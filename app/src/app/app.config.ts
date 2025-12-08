import {
    ApplicationConfig,
    provideBrowserGlobalErrorListeners,
    provideZoneChangeDetection,
} from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideOmloxClient } from '@kodira/omlox-client-typescript-angular';

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideHttpClient(),
        // OMLOX client (standalone)
        provideOmloxClient({
            baseUrl: '/api',
        }),
    ],
};
