import { TestBed } from '@angular/core/testing';
import { AuthInterceptorService } from './auth-interceptor.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { of, noop } from 'rxjs';
import { TokenStoreService } from './token-store.service';

class TokenStoreServiceStub {
  refreshToken = 'FAKE_REFRESH_TOKEN';
  authToken = 'FAKE_AUTH_TOKEN';
}

describe('AuthInterceptorService', () => {
  let authServiceStub: jasmine.SpyObj<AuthService>;
  let http: HttpClient;
  let httpController: HttpTestingController;

  beforeEach(() => {
    authServiceStub = jasmine.createSpyObj<AuthService>('AuthService', ['reauth']);
  });

  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule,
    ],
    providers: [
      { provide: AuthService, useValue: authServiceStub },
      { provide: TokenStoreService, useClass: TokenStoreServiceStub },
      { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true },
    ]
  }));

  beforeEach(() => {
    http = TestBed.inject(HttpClient);
    httpController = TestBed.inject(HttpTestingController);
  });

  it('should not add the Authorization header', () => {
    http.get('FAKE_URL').subscribe();
    const request = httpController.expectOne('FAKE_URL');
    expect(request.request.headers.has('Authorization')).toEqual(false);
  });

  describe('when authenticated', () => {
    beforeEach(() => {
      authServiceStub.authenticated = true;
    });

    it('should add an Authorization header', () => {
      http.get('FAKE_URL').subscribe();
      const request = httpController.expectOne('FAKE_URL');
      expect(request.request.headers.get('Authorization')).toEqual('Bearer FAKE_AUTH_TOKEN');
    });

    it('should refresh the auth token if the server responds with 401', () => {
      authServiceStub.reauth.and.returnValue(of('FAKE_NEW_AUTH_TOKEN'));
      http.get('FAKE_URL').subscribe();
      httpController.expectOne('FAKE_URL').error(null, { status: 401 });
      expect(authServiceStub.reauth).toHaveBeenCalled();
      const req = httpController.expectOne('FAKE_URL');
      expect(req.request.headers.get('Authorization')).toEqual('Bearer FAKE_NEW_AUTH_TOKEN');
    });

    it('should throw an error on any other server error', done => {
      http.get('FAKE_URL').subscribe(noop, done);
      httpController.expectOne('FAKE_URL').error(null, { status: 500 });
      expect(authServiceStub.reauth).not.toHaveBeenCalled();
    });
  });
});
