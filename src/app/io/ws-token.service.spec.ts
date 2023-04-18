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
      beforeEach(() => {
        // authService.authenticated = false;
      });

      it('should return null', () => {
        service.getWsToken().subscribe(token => expect(token).toEqual(null));
      });
    });

    describe('when authenticated', () => {
      beforeEach(() => {
        // authService.authenticated = true;
      });
    });
  });
});
