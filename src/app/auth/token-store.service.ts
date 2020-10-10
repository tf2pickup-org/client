import { Injectable, Inject } from '@angular/core';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { HttpParams } from '@angular/common/http';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class TokenStoreService {

  private readonly refreshTokenKey = 'refresh_token';
  private readonly authTokenKey = 'auth_token';
  private readonly wsTokenKey = 'ws_token';

  constructor(
    @Inject(LOCAL_STORAGE) private storage: StorageService,
  ) {
    this.retrieveTokens();
  }

  get refreshToken(): string {
    return this.storage.get(this.refreshTokenKey);
  }

  set refreshToken(refreshToken: string) {
    this.storage.set(this.refreshTokenKey, refreshToken);
  }

  get authToken(): string {
    return this.storage.get(this.authTokenKey);
  }

  set authToken(authToken: string) {
    this.storage.set(this.authTokenKey, authToken);
  }

  get wsToken(): string {
    return this.storage.get(this.wsTokenKey);
  }

  set wsToken(wsToken: string) {
    this.storage.set(this.wsTokenKey, wsToken);
  }

  removeAllTokens() {
    this.storage.clear();
  }

  private retrieveTokens() {
    // gives access to params in the URL that could be passed from the backend
    const params = new HttpParams({
      fromString: window.location.search.substr(1),
    });

    let needsToRemoveHash = false;

    // first try to find the refresh token
    if (params.has('refresh_token')) {
      this.refreshToken = params.get('refresh_token');
      needsToRemoveHash = true;
    }

    if (this.refreshToken) {
      try {
        const decoded = jwt_decode(this.refreshToken) as { exp: number };
        if (Date.now() >= decoded.exp * 1000) {
          // the refresh token has expired
          this.storage.remove(this.refreshTokenKey);
          return;
        }
      } catch (error) { // failed to decode token
        console.error(error);
        this.storage.remove(this.refreshTokenKey);
        return;
      }
    }

    // and then try to find the auth token
    if (params.has('auth_token')) {
      this.authToken = params.get('auth_token');
      needsToRemoveHash = true;
    }

    if (needsToRemoveHash) {
      this.removeHash();
    }
  }

  private removeHash() {
    history.pushState('', document.title, window.location.pathname);
  }

}
