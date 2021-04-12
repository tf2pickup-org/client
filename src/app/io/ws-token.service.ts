import { Injectable, Inject } from '@angular/core';
import { TokenStoreService } from '@app/auth/token-store.service';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { AuthService } from '@app/auth/auth.service';
import jwt_decode from 'jwt-decode';
import { API_URL } from '@app/api-url';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class WsTokenService {
  constructor(
    private authService: AuthService,
    private tokenStore: TokenStoreService,
    private http: HttpClient,
    @Inject(API_URL) private apiUrl: string,
  ) {}

  getWsToken(options?: { force?: boolean }): Observable<string | null> {
    if (!this.authService.authenticated) {
      return of(null);
    }

    if (!this.tokenStore.wsToken) {
      return this.refreshToken();
    }

    if (options?.force) {
      return this.refreshToken();
    }

    try {
      const decoded = jwt_decode(this.tokenStore.wsToken) as { exp: number };
      if (Date.now() >= decoded.exp * 1000) {
        return this.refreshToken();
      } else {
        return of(this.tokenStore.wsToken);
      }
    } catch (error) {
      console.error(error);
      return this.refreshToken();
    }
  }

  private refreshToken(): Observable<string> {
    return this.http
      .get<{ wsToken: string }>(`${this.apiUrl}/auth/wstoken`)
      .pipe(
        map(({ wsToken }) => wsToken),
        tap(wsToken => (this.tokenStore.wsToken = wsToken)),
      );
  }
}
