import { TestBed } from '@angular/core/testing';
import { WsTokenService } from './ws-token.service';
import {
  HttpTestingController,
  HttpClientTestingModule,
} from '@angular/common/http/testing';
import { TokenStoreService } from '@app/auth/token-store.service';
import { AuthService } from '@app/auth/auth.service';
import { API_URL } from '@app/api-url';

class AuthServiceStub {
  authenticated: false;
}

class TokenStoreServiceStub {
  wsToken: undefined;
}

describe('WsTokenService', () => {
  let service: WsTokenService;
  let httpController: HttpTestingController;
  let authService: AuthService;
  let tokenStoreService: TokenStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: AuthService, useClass: AuthServiceStub },
        { provide: TokenStoreService, useClass: TokenStoreServiceStub },
        { provide: API_URL, useValue: 'FAKE_URL' },
      ],
    });

    service = TestBed.inject(WsTokenService);
    httpController = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService);
    tokenStoreService = TestBed.inject(TokenStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#getWsToken()', () => {
    describe('when not authenticated', () => {
      beforeEach(() => {
        authService.authenticated = false;
      });

      it('should return null', () => {
        service.getWsToken().subscribe(token => expect(token).toEqual(null));
      });
    });

    describe('when authenticated', () => {
      beforeEach(() => {
        authService.authenticated = true;
      });

      describe('when the ws token is not in the store', () => {
        beforeEach(() => {
          tokenStoreService.wsToken = undefined;
        });

        it('should refresh the token', () => {
          expect(authService.authenticated).toBe(true);
          service
            .getWsToken()
            .subscribe(token => expect(token).toEqual('FAKE_TOKEN'));
          httpController
            .expectOne('FAKE_URL/auth/wstoken')
            .flush({ wsToken: 'FAKE_TOKEN' });
          expect(tokenStoreService.wsToken).toEqual('FAKE_TOKEN');
        });
      });

      describe('when the token is in the store', () => {
        beforeEach(() => {
          tokenStoreService.wsToken = 'FAKE_TOKEN';
        });

        xit('should retrieve the token from the store', done => {
          service.getWsToken().subscribe(token => {
            expect(token).toEqual('FAKE_TOKEN');
            done();
          });
        });

        it('should refresh the token if forcing', () => {
          service
            .getWsToken()
            .subscribe(token => expect(token).toEqual('FAKE_NEW_TOKEN'));
          httpController
            .expectOne('FAKE_URL/auth/wstoken')
            .flush({ wsToken: 'FAKE_NEW_TOKEN' });
          expect(tokenStoreService.wsToken).toEqual('FAKE_NEW_TOKEN');
        });
      });
    });
  });
});
