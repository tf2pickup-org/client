import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable, EMPTY, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

  constructor(
    private authService: AuthService,
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(this.makeRequest(request)).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          this.authService.login();
          return EMPTY;
        } else {
          return throwError(error);
        }
      })
    );
  }

  private makeRequest(request: HttpRequest<any>) {
    return this.authService.authenticated ? request.clone({
      setHeaders: {
        Authorization: `Bearer ${this.authService.token}`,
      }
    }) : request;
  }

}
