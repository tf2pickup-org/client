import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap, map, first } from 'rxjs/operators';
import { TokenStoreService } from './token-store.service';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(
    private tokenStore: TokenStoreService,
    private authService: AuthService,
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    if (!this.authService.authenticated) {
      return next.handle(request);
    }

    const authorizedRequest = this.applyAuthToken(
      request,
      this.tokenStore.authToken,
    );
    return next.handle(authorizedRequest).pipe(
      catchError((error: unknown) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.reauth(request).pipe(switchMap(req => next.handle(req)));
        } else {
          return throwError(error);
        }
      }),
    );
  }

  private applyAuthToken(
    request: HttpRequest<any>,
    token: string,
  ): HttpRequest<any> {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    return request.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }

  private reauth(request: HttpRequest<any>): Observable<HttpRequest<any>> {
    return this.authService
      .reauth()
      .pipe(map(token => this.applyAuthToken(request, token)));
  }
}
