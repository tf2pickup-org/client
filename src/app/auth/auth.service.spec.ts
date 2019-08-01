import { TestBed, inject, async } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { API_URL } from '@app/api-url';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('AuthService', () => {
  let httpContoller: HttpTestingController;

  beforeEach(() => TestBed.configureTestingModule({
    imports: [ HttpClientTestingModule ],
    providers: [
      { provide: API_URL, useValue: 'FAKE_URL' },
    ]
  }));

  beforeEach(() => {
    httpContoller = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    const service: AuthService = TestBed.get(AuthService);
    expect(service).toBeTruthy();
  });

  describe('#reauth()', () => {
    it('should call endpoint', inject([AuthService], (service: AuthService) => {
      service.authenticated = true;
      service.refreshToken = 'FAKE_TOKEN';

      service.reauth().subscribe();
      const req = httpContoller.expectOne('FAKE_URL/auth?refresh_token=FAKE_TOKEN');
      expect(req.request.method).toBe('GET');

      expect().nothing();
    }));

    it('should emit the new token', async(inject([AuthService], (service: AuthService) => {
      service.authenticated = true;
      service.refreshToken = 'FAKE_REFRESH_TOKEN_0';

      service.reauth().subscribe();
      const req = httpContoller.expectOne('FAKE_URL/auth?refresh_token=FAKE_REFRESH_TOKEN_0');
      req.flush({ refreshToken: 'FAKE_REFRESH_TOKEN_1', authToken: 'FAKE_AUTH_TOKEN' });

      expect(service.refreshToken).toEqual('FAKE_REFRESH_TOKEN_1');
      service.authToken.subscribe(token => expect(token).toEqual('FAKE_AUTH_TOKEN'));
    })));
  });

});
