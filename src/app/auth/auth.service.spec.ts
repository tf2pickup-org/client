import { TestBed, inject, async } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { API_URL } from '@app/api-url';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TokenStoreService } from './token-store.service';

class TokenStoreServiceStub {
  refreshToken = 'FAKE_REFRESH_TOKEN';
  authToken = 'FAKE_AUTH_TOKEN';
}

describe('AuthService', () => {
  let httpContoller: HttpTestingController;

  beforeEach(() => TestBed.configureTestingModule({
    imports: [ HttpClientTestingModule ],
    providers: [
      { provide: API_URL, useValue: 'FAKE_URL' },
      { provide: TokenStoreService, useClass: TokenStoreServiceStub },
    ]
  }));

  beforeEach(() => {
    httpContoller = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    const service: AuthService = TestBed.get(AuthService);
    expect(service).toBeTruthy();
  });

  it('should be authenticated', inject([AuthService], (service: AuthService) => {
    expect(service.authenticated).toBe(true);
  }));

  describe('#reauth()', () => {
    it('should call endpoint', inject([AuthService], (service: AuthService) => {
      service.reauth().subscribe();
      const req = httpContoller.expectOne('FAKE_URL/auth?refresh_token=FAKE_REFRESH_TOKEN');
      expect(req.request.method).toBe('POST');
    }));

    it('should emit the new token', async(inject([AuthService], (service: AuthService) => {
      const tokenStore = TestBed.get(TokenStoreService);

      service.reauth().subscribe(authToken => expect(authToken).toEqual('FAKE_NEW_AUTH_TOKEN'));
      const req = httpContoller.expectOne('FAKE_URL/auth?refresh_token=FAKE_REFRESH_TOKEN');
      req.flush({ refreshToken: 'FAKE_NEW_REFRESH_TOKEN', authToken: 'FAKE_NEW_AUTH_TOKEN' });
      expect(tokenStore.refreshToken).toEqual('FAKE_NEW_REFRESH_TOKEN');
      expect(tokenStore.authToken).toEqual('FAKE_NEW_AUTH_TOKEN');
    })));
  });

});
