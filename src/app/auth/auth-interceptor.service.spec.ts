import { TestBed } from '@angular/core/testing';
import { AuthInterceptorService } from './auth-interceptor.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

class AuthServiceStub {
  authenticated = false;
  authToken = of('FAKE_TOKEN');
  reauth() { }
}

describe('AuthInterceptorService', () => {
  let authService: AuthServiceStub;
  let http: HttpClient;
  let httpController: HttpTestingController;

  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule,
    ],
    providers: [
      { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true },
      { provide: AuthService, useClass: AuthServiceStub },
    ]
  }));

  beforeEach(() => {
    authService = TestBed.get(AuthService);
    http = TestBed.get(HttpClient);
    httpController = TestBed.get(HttpTestingController);
  });

  it('should add an Authorization header', () => {
    authService.authenticated = true;
    http.get('FAKE_URL').subscribe();
    const request = httpController.expectOne('FAKE_URL');
    expect(request.request.headers.has('Authorization')).toEqual(true);
    expect(request.request.headers.get('Authorization')).toEqual('Bearer FAKE_TOKEN');
  });

  it('should not add the Authorization header if not logged in', () => {
    http.get('FAKE_URL').subscribe();
    const request = httpController.expectOne('FAKE_URL');
    expect(request.request.headers.has('Authorization')).toEqual(false);
  });

  it('should call AuthService.reauth() if the server responded with 401', () => {
    authService.authenticated = true;
    const spy = spyOn(authService, 'reauth');
    http.get('FAKE_URL').subscribe();
    httpController.expectOne('FAKE_URL').error(null, { status: 401 });
    expect(spy).toHaveBeenCalled();
  });
});
