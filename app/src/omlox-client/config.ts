import { InjectionToken } from '@angular/core';

/**
 * Configuration interface for the OMLOX client.
 * Defines the base URL and optional default headers for API requests.
 */
export interface OmloxClientConfig {
    /** Base URL for the OMLOX API endpoint */
    baseUrl: string;
    /** Optional default headers to include with all requests */
    defaultHeaders?: { [key: string]: string };
}

/**
 * Injection token for the OMLOX client configuration.
 * Use this token to provide configuration when using standalone services.
 */
export const OMLOX_CLIENT_CONFIG = new InjectionToken<OmloxClientConfig>('OMLOX_CLIENT_CONFIG');
