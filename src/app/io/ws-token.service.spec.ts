import { TestBed } from '@angular/core/testing';
import { WsTokenService } from './ws-token.service';
import {
  HttpTestingController,
  HttpClientTestingModule,
} from '@angular/common/http/testing';
import { API_URL } from '@app/api-url';

describe('WsTokenService', () => {
  let service: WsTokenService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: API_URL, useValue: 'FAKE_URL' }],
    });

    service = TestBed.inject(WsTokenService);
    httpController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#getWsToken()', () => {
    describe('when not authenticated', () => {
      it('should return null', () => {
        service.getWsToken().subscribe(token => expect(token).toEqual(null));
        httpController
          .expectOne('FAKE_URL/auth/wstoken')
          .flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
      });
    });

    describe('when authenticated', () => {
      it('should return the token', () => {
        service
          .getWsToken()
          .subscribe(token => expect(token).toEqual('FAKE_TOKEN'));
        httpController
          .expectOne('FAKE_URL/auth/wstoken')
          .flush({ wsToken: 'FAKE_TOKEN' });
      });
    });
  });
});
