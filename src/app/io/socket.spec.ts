import { Socket } from './socket';
import { TestBed } from '@angular/core/testing';
import { SocketFactoryService } from './socket-factory.service';
import EventEmitter from 'eventemitter3';

class SocketFactoryServiceStub {
  socket = new EventEmitter();
  createSocket() {
    return this.socket;
  }
}

describe('Socket', () => {
  let socket: Socket;
  let socketFactoryService: SocketFactoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: SocketFactoryService, useClass: SocketFactoryServiceStub },
      ],
    });

    socket = TestBed.inject(Socket);
    socketFactoryService = TestBed.inject(SocketFactoryService);
  });

  describe('#on()', () => {
    it('should add event listener', () => {
      socket.on('queue state update', () => {});
      expect(
        // @ts-expect-error socket is private
        socketFactoryService.socket.listenerCount('queue state update'),
      ).toEqual(1);
    });
  });

  describe('#off()', () => {
    beforeEach(() => {
      socket.on('queue state update', () => {});
    });

    it('should remove event listener', () => {
      socket.off('queue state update');
      expect(
        // @ts-expect-error socket is private
        socketFactoryService.socket.listenerCount('queue state update'),
      ).toEqual(0);
    });
  });

  describe('#call()', () => {
    it('should emit the method name', () => {
      // @ts-expect-error socket is private
      const spy = spyOn(socketFactoryService.socket, 'emit');
      socket.call('mark friend').subscribe();
      expect(spy).toHaveBeenCalledWith(
        'mark friend',
        {},
        jasmine.any(Function),
      );
    });
  });
});
