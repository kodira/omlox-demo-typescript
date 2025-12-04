import { Injectable, Inject, Optional } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { OmloxClientConfig, OMLOX_CLIENT_CONFIG } from './config';

/**
 * Base service class for OMLOX API client.
 * Provides common HTTP functionality and authentication handling for all OMLOX services.
 * All specific service classes (Trackables, Zones, Fences, Providers) extend this base class.
 */
@Injectable({
    providedIn: 'root',
})
export class OmloxBaseService {
    /** Base URL for the OMLOX API endpoint */
    protected baseUrl: string;
    /** Default HTTP headers to be included with all requests */
    protected defaultHeaders: HttpHeaders;
    /** Bearer token for API authentication */
    private bearerToken?: string;
    /** Unique identifier for this service instance */
    private instanceId: string;

    /**
     * Constructs the base service with HTTP client and optional configuration.
     * @param http Angular HTTP client for making API requests
     * @param config Optional configuration for the OMLOX client
     */
    constructor(
        protected http: HttpClient,
        @Optional() @Inject(OMLOX_CLIENT_CONFIG) private config?: OmloxClientConfig
    ) {
        this.instanceId = Math.random().toString(36).substr(2, 9);
        this.baseUrl = this.config?.baseUrl || '/api';
        this.defaultHeaders = new HttpHeaders(this.config?.defaultHeaders || {});
    }

    /**
     * Sets the Bearer token for API authentication.
     * @param token The authentication token to use for API requests, or null to clear
     */
    setBearerToken(token: string | null): void {
        this.bearerToken = token || undefined;
    }

    /**
     * Gets the current Bearer token.
     * @returns The current authentication token, or undefined if not set
     */
    getBearerToken(): string | undefined {
        return this.bearerToken;
    }

    /**
     * Constructs HTTP headers with authentication information.
     * Combines default headers with Authorization header if Bearer token is set.
     * @returns HttpHeaders object with authentication headers
     */
    protected getAuthHeaders(): HttpHeaders {
        let headers = this.defaultHeaders;

        if (this.bearerToken) {
            headers = headers.set('Authorization', `Bearer ${this.bearerToken}`);
        }

        return headers;
    }

    /**
     * Makes an HTTP request to the OMLOX API with authentication and error handling.
     * @param method HTTP method to use (GET, POST, PUT, DELETE, PATCH)
     * @param path API endpoint path (will be appended to baseUrl)
     * @param options Request options including body, parameters, and headers
     * @returns Observable with the response data
     */
    protected request<T>(
        method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
        path: string,
        options?: {
            body?: any;
            params?: HttpParams;
            headers?: HttpHeaders;
            responseType?: 'json';
        }
    ): Observable<T> {
        const url = `${this.baseUrl}${path}`;
        const authHeaders = this.getAuthHeaders();
        const finalHeaders = options?.headers
            ? options.headers.set('Authorization', authHeaders.get('Authorization') || '')
            : authHeaders;

        const httpOptions = {
            headers: finalHeaders,
            params: options?.params,
            body: options?.body,
        };

        return this.http
            .request<T>(method, url, httpOptions)
            .pipe(catchError(this.handleError.bind(this)));
    }

    /**
     * Makes a GET request to the OMLOX API.
     * @param path API endpoint path
     * @param params Optional query parameters
     * @param headers Optional additional headers
     * @returns Observable with the response data
     */
    protected get<T>(path: string, params?: HttpParams, headers?: HttpHeaders): Observable<T> {
        return this.request<T>('GET', path, { params, headers });
    }

    /**
     * Makes a POST request to the OMLOX API with JSON content type.
     * @param path API endpoint path
     * @param body Request body data
     * @param headers Optional additional headers
     * @returns Observable with the response data
     */
    protected post<T>(path: string, body?: any, headers?: HttpHeaders): Observable<T> {
        const finalHeaders =
            headers?.set('Content-Type', 'application/json') ||
            this.getAuthHeaders().set('Content-Type', 'application/json');
        return this.request<T>('POST', path, { body, headers: finalHeaders });
    }

    /**
     * Makes a PUT request to the OMLOX API with JSON content type.
     * @param path API endpoint path
     * @param body Request body data
     * @param headers Optional additional headers
     * @returns Observable with the response data
     */
    protected put<T>(path: string, body?: any, headers?: HttpHeaders): Observable<T> {
        const finalHeaders =
            headers?.set('Content-Type', 'application/json') ||
            this.getAuthHeaders().set('Content-Type', 'application/json');
        return this.request<T>('PUT', path, { body, headers: finalHeaders });
    }

    /**
     * Makes a DELETE request to the OMLOX API.
     * @param path API endpoint path
     * @param headers Optional additional headers
     * @returns Observable with the response data
     */
    protected delete<T>(path: string, headers?: HttpHeaders): Observable<T> {
        return this.request<T>('DELETE', path, { headers });
    }

    /**
     * Handles HTTP errors and transforms them into user-friendly error messages.
     * Logs the error details and returns an observable that emits an Error.
     * @param error HttpErrorResponse from the failed HTTP request
     * @returns Observable that throws an Error with descriptive message
     */
    private handleError(error: HttpErrorResponse): Observable<never> {
        let errorMessage = 'An unknown error occurred';

        if (error.error instanceof ErrorEvent) {
            errorMessage = `Client-side error: ${error.error.message}`;
        } else {
            switch (error.status) {
                case 401:
                    errorMessage = 'Unauthorized - Invalid or missing authentication token';
                    break;
                case 403:
                    errorMessage = 'Forbidden - Insufficient permissions';
                    break;
                case 404:
                    errorMessage = 'Not found';
                    break;
                case 500:
                    errorMessage = 'Internal server error';
                    break;
                default:
                    errorMessage = `Server error: ${error.status} ${error.statusText}`;
                    if (error.error?.message) {
                        errorMessage += ` - ${error.error.message}`;
                    }
            }
        }

        console.error('Omlox API Error:', errorMessage, error);
        return throwError(() => new Error(errorMessage));
    }
}
