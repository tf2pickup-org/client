import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

  constructor(
    private authService: AuthService,
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(this.makeRequest(request));
  }

  private makeRequest(request: HttpRequest<any>) {
    return this.authService.authenticated ? request.clone({
      setHeaders: {
        Authorization: `Bearer ${this.authService.token}`,
      }
    }) : request;
  }

}
