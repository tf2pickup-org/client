import { TestBed } from '@angular/core/testing';
import { AuthInterceptorService } from './auth-interceptor.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { TokenStoreService } from './token-store.service';

class AuthServiceStub {
  authenticated = false;
  reauth() { return of('FAKE_AUTH_TOKEN'); }
}

class TokenStoreServiceStub {
  refreshToken = 'FAKE_REFRESH_TOKEN';
  authToken = 'FAKE_AUTH_TOKEN';
}

describe('AuthInterceptorService', () => {
  let authService: AuthServiceStub;
  let tokenStoreService: TokenStoreServiceStub;
  let http: HttpClient;
  let httpController: HttpTestingController;

  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule,
    ],
    providers: [
      { provide: AuthService, useClass: AuthServiceStub },
      { provide: TokenStoreService, useClass: TokenStoreServiceStub },
      { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true },
    ]
  }));

  beforeEach(() => {
    authService = TestBed.get(AuthService);
    tokenStoreService = TestBed.get(TokenStoreService);
    http = TestBed.get(HttpClient);
    httpController = TestBed.get(HttpTestingController);
  });

  it('should add an Authorization header', () => {
    authService.authenticated = true;
    http.get('FAKE_URL').subscribe();
    const request = httpController.expectOne('FAKE_URL');
    expect(request.request.headers.has('Authorization')).toEqual(true);
    expect(request.request.headers.get('Authorization')).toEqual('Bearer FAKE_AUTH_TOKEN');
  });

  it('should not add the Authorization header if not logged in', () => {
    http.get('FAKE_URL').subscribe();
    const request = httpController.expectOne('FAKE_URL');
    expect(request.request.headers.has('Authorization')).toEqual(false);
  });

  it('should refresh the auth token if the server responded with 401', () => {
    authService.authenticated = true;
    const spy = spyOn(authService, 'reauth').and.returnValue(of('FAKE_NEW_AUTH_TOKEN'));
    http.get('FAKE_URL').subscribe();
    httpController.expectOne('FAKE_URL').error(null, { status: 401 });
    expect(spy).toHaveBeenCalled();
    const req = httpController.expectOne('FAKE_URL');
    expect(req.request.headers.get('Authorization')).toEqual('Bearer FAKE_NEW_AUTH_TOKEN');
  });
});
