import { TestBed } from '@angular/core/testing';
import { SocketFactoryService } from './socket-factory.service';
import { TokenStoreService } from '@app/auth/token-store.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { WS_URL } from '@app/ws-url';
import { WsTokenService } from './ws-token.service';
import { NEVER } from 'rxjs';

class WsTokenServiceStub {
  getWsToken() { return NEVER; }
}

describe('SocketFactoryService', () => {
  let service: SocketFactoryService;
  let httpController: HttpTestingController;
  let tokenStore: TokenStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: [
        { provide: WsTokenService, useClass: WsTokenServiceStub },
        { provide: WS_URL, useValue: 'FAKE_URL' },
      ],
    });

    service = TestBed.inject(SocketFactoryService);
    httpController = TestBed.inject(HttpTestingController);
    tokenStore = TestBed.inject(TokenStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#createSocket', () => {
    it('should return a socket', () => {
      const socket = service.createSocket();
      expect(socket).toBeTruthy();
      expect(socket.connected).toBe(false);
      expect(socket.nsp).toEqual('/');
      expect(socket.io.uri).toEqual('http://FAKE_URL');
      expect(socket.io.opts.autoConnect).toBe(false);
    });

    describe('created socket', () => {
      let socket: SocketIOClient.Socket;

      beforeEach(() => {
        socket = service.createSocket();
      });

      it('should handle signature verification error', () => {
        const spy = spyOn(TestBed.inject(WsTokenService), 'getWsToken').and.callThrough();
        socket.emit('error', new Error('Signature verification failed'));
        expect(spy).toHaveBeenCalledWith({ force: true });
      });
    });
  });
});
