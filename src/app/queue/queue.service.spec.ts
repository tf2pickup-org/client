import { TestBed, inject } from '@angular/core/testing';
import { QueueService } from './queue.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { API_URL } from '@app/api-url';
import { Socket } from '@app/io/socket';

describe('QueueService', () => {
  let httpController: HttpTestingController;
  let socketStub: jasmine.SpyObj<Socket>;

  beforeEach(() => {
    socketStub = jasmine.createSpyObj<Socket>('Socket', [ 'call' ]);
  });

  beforeEach(() => TestBed.configureTestingModule({
    imports: [ HttpClientTestingModule ],
    providers: [
      { provide: API_URL, useValue: 'FAKE_URL' },
      { provide: Socket, useValue: socketStub },
    ],
  }));

  beforeEach(() => {
    httpController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    const service: QueueService = TestBed.inject(QueueService);
    expect(service).toBeTruthy();
  });

  describe('#fetchQueue()', () => {
    it('should call the endpoint', inject([QueueService], (service: QueueService) => {
      service.fetchQueue().subscribe();
      httpController.expectOne('FAKE_URL/queue');
      expect().nothing();
    }));
  });

  describe('#joinQueue()', () => {
    it('should call the endpoint', inject([QueueService], (service: QueueService) => {
      service.joinQueue(11);
      expect(socketStub.call).toHaveBeenCalledWith('join queue', { slotId: 11 });
    }));
  });

  describe('#leaveQueue()', () => {
    it('should call the endpoint', inject([QueueService], (service: QueueService) => {
      service.leaveQueue();
      expect(socketStub.call).toHaveBeenCalledWith('leave queue');
    }));
  });

  describe('#readyUp()', () => {
    it('should call the endpoint', inject([QueueService], (service: QueueService) => {
      service.readyUp();
      expect(socketStub.call).toHaveBeenCalledWith('player ready');
    }));
  });

  describe('#voteForMap()', () => {
    it('should call the endpoint', inject([QueueService], (service: QueueService) => {
      service.voteForMap('cp_fake_rc1');
      expect(socketStub.call).toHaveBeenCalledWith('vote for map', { map: 'cp_fake_rc1' });
    }));
  });

  describe('#markFriend()', () => {
    it('should call the endpoint', inject([QueueService], (service: QueueService) => {
      service.markFriend('FAKE_ID');
      expect(socketStub.call).toHaveBeenCalledWith('mark friend', { friendPlayerId: 'FAKE_ID' });
    }));
  });
});
