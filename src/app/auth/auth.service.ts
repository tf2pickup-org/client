import { Injectable, Inject } from '@angular/core';
import { HttpParams, HttpClient, HttpBackend } from '@angular/common/http';
import { API_URL } from '@app/api-url';
import * as jwt_decode from 'jwt-decode';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, mapTo, filter } from 'rxjs/operators';

export interface TokenPair {
  refreshToken: string;
  authToken: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http: HttpClient;
  private _authToken = new BehaviorSubject<string>(null);
  refreshToken: string;
  authenticated: boolean;

  get authToken(): Observable<string> {
    return this._authToken.asObservable().pipe(filter(token => !!token));
  }

  constructor(
    @Inject(API_URL) private apiUrl: string,
    httpBackend: HttpBackend,
  ) {
    this.http = new HttpClient(httpBackend);
    this.retrieveTokens();
  }

  login() {
    localStorage.removeItem('refresh_token');
    window.location.href = `${this.apiUrl}/auth/steam`;
  }

  reauth(): Observable<string> {
    if (this._authToken.value !== null)  {
      console.log('refreshing token');
      this._authToken.next(null);
      this.http.get<TokenPair>(`${this.apiUrl}/auth?refresh_token=${this.refreshToken}`).pipe(
        tap(({ refreshToken }) => this.refreshToken = refreshToken),
        tap(({ authToken }) => this._authToken.next(authToken)),
      ).subscribe();
    }

    return this.authToken;
  }

  private retrieveTokens() {
    // gives access to params in the URL that could be passed from the backend
    const params = new HttpParams({
      fromString: window.location.search.substr(1),
    });

    // first try to find the refresh token
    let refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      if (params.has('refresh_token')) {
        refreshToken = params.get('refresh_token');
      } else {
        this.authenticated = false;
        return;
      }
    }

    const decoded = jwt_decode(refreshToken) as { exp: number };
    if (Date.now() >= decoded.exp * 1000) {
      // the refresh token has expired
      localStorage.removeItem('refresh_token');
      this.authenticated = false;
      return;
    } else {
      this.setRefreshToken(refreshToken);
    }

    // and then try to find the auth token
    if (params.has('auth_token')) {
      this._authToken.next(params.get('auth_token'));
    } else {
      this.http.get<TokenPair>(`${this.apiUrl}/auth?refresh_token=${this.refreshToken}`).pipe(
        tap(({ refreshToken }) => this.setRefreshToken(refreshToken)),
        tap(({ authToken }) => this._authToken.next(authToken)),
      ).subscribe();
    }

    this.authenticated = true;
    this.removeHash();
  }

  private removeHash() {
    history.pushState('', document.title, window.location.pathname);
  }

  private setRefreshToken(refreshToken: string) {
    this.refreshToken = refreshToken;
    localStorage.setItem('refresh_token', refreshToken);
  }

}
