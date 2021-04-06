import { Injectable, Inject } from '@angular/core';
import {
  HttpClient,
  HttpBackend,
  HttpErrorResponse,
} from '@angular/common/http';
import { API_URL } from '@app/api-url';
import { Observable, EMPTY, throwError, Subject } from 'rxjs';
import { tap, catchError, map, first } from 'rxjs/operators';
import { TokenStoreService } from './token-store.service';

export interface TokenPair {
  refreshToken: string;
  authToken: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  authenticated: boolean;
  private http: HttpClient;
  private isRefreshingToken = false;
  private authToken = new Subject<string>();

  constructor(
    @Inject(API_URL) private apiUrl: string,
    httpBackend: HttpBackend,
    private tokenStore: TokenStoreService,
  ) {
    this.http = new HttpClient(httpBackend); // solves circular injection dependency problem
    this.authenticated = !!this.tokenStore.refreshToken;
  }

  login() {
    window.location.href = `${this.apiUrl}/auth/steam`;
  }

  logout() {
    this.tokenStore.removeAllTokens();
    location.reload();
  }

  reauth(): Observable<string> {
    if (!this.isRefreshingToken) {
      this.isRefreshingToken = true;
      return this.http
        .post<TokenPair>(
          `${this.apiUrl}/auth?refresh_token=${this.tokenStore.refreshToken}`,
          {},
        )
        .pipe(
          tap(
            ({ refreshToken }) => (this.tokenStore.refreshToken = refreshToken),
          ),
          tap(({ authToken }) => (this.tokenStore.authToken = authToken)),
          catchError((error: unknown) => {
            if (error instanceof HttpErrorResponse && error.status === 400) {
              this.login();
              return EMPTY;
            } else {
              return throwError(error);
            }
          }),
          tap(() => (this.isRefreshingToken = false)),
          map(({ authToken }) => authToken),
          tap(authToken => this.authToken.next(authToken)),
        );
    } else {
      return this.authToken.asObservable().pipe(first());
    }
  }
}
