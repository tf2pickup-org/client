import { TestBed } from '@angular/core/testing';
import { SocketFactoryService } from './socket-factory.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { WS_URL } from '@app/ws-url';
import { WsTokenService } from './ws-token.service';
import { NEVER } from 'rxjs';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

class WsTokenServiceStub {
  // skipcq: JS-0105
  getWsToken() {
    return NEVER;
  }
}

describe('SocketFactoryService', () => {
  let service: SocketFactoryService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: WsTokenService, useClass: WsTokenServiceStub },
        { provide: WS_URL, useValue: 'FAKE_URL' },
        provideMockStore(),
      ],
    });

    service = TestBed.inject(SocketFactoryService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => TestBed.inject(MockStore)?.resetSelectors());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#createSocket', () => {
    it('should return a socket', () => {
      const socket = service.createSocket();
      expect(socket).toBeTruthy();
      expect(socket.connected).toBe(false);
    });
  });
});
