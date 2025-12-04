import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../environments/environment';

interface TokenResponse {
    access_token: string;
    expires_in: number;
    token_type: string;
}

@Injectable({
    providedIn: 'root',
})
export class OAuthService {
    private readonly oauth_url = '/auth/token';
    private readonly client_id = environment.oauth.clientId;
    private readonly client_secret = environment.oauth.clientSecret;

    private tokenSubject = new BehaviorSubject<string | null>(null);
    private tokenExpiration: number = 0;

    constructor(private http: HttpClient) {}

    public getToken(): Observable<string> {
        const now = Date.now();

        if (this.tokenSubject.value && now < this.tokenExpiration) {
            return this.tokenSubject.asObservable().pipe(map((token) => token!));
        }

        return this.refreshToken();
    }

    private refreshToken(): Observable<string> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded',
        });

        const body = new URLSearchParams();
        body.set('grant_type', 'client_credentials');
        body.set('client_id', this.client_id);
        body.set('client_secret', this.client_secret);

        return this.http.post<TokenResponse>(this.oauth_url, body.toString(), { headers }).pipe(
            map((response) => {
                const token = response.access_token;
                this.tokenExpiration = Date.now() + response.expires_in * 1000 - 30000; // Refresh 30s before expiry
                this.tokenSubject.next(token);
                return token;
            }),
            catchError((error) => {
                console.error('OAuth token request failed:', error);
                return throwError(() => error);
            })
        );
    }

    public isAuthenticated(): boolean {
        return this.tokenSubject.value !== null && Date.now() < this.tokenExpiration;
    }
}
