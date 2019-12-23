import { TestBed } from '@angular/core/testing';
import { QueueEventsService } from './queue-events.service';
import { IoClientService } from '@app/core/io-client.service';
import { EventEmitter } from 'events';
import { QueueSlot } from './models/queue-slot';
import { of } from 'rxjs';

class IoClientServiceStub  {
  socket = of(new EventEmitter());
}

describe('QueueEventsService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      { provide: IoClientService, useClass: IoClientServiceStub },
    ]
  }));

  it('should be created', () => {
    const service: QueueEventsService = TestBed.get(QueueEventsService);
    expect(service).toBeTruthy();
  });

  describe('io event forwarder', () => {
    let service: QueueEventsService;
    let ioClientService: IoClientServiceStub;

    beforeEach(() => {
      service = TestBed.get(QueueEventsService);
      ioClientService = TestBed.get(IoClientService);
    });

    it('should forward queue slots update', () => {
      const slot: QueueSlot = { id: 0, gameClass: 'scout', ready: false };
      service.slotsUpdate.subscribe(event => expect(event).toEqual([ slot ]));
      ioClientService.socket.subscribe(socket => socket.emit('queue slots update', [ slot ]));
    });

    it('should forward queue state update', () => {
      service.stateUpdate.subscribe(event => expect(event).toEqual('ready'));
      ioClientService.socket.subscribe(socket => socket.emit('queue state update', 'ready'));
    });

    it('should forward map vote results updated', () => {
      service.mapVoteResultsUpdate.subscribe(event => expect(event).toEqual([]));
      ioClientService.socket.subscribe(socket => socket.emit('map vote results update', []));
    });
  });
});
