import { TestBed, inject } from '@angular/core/testing';
import { QueueService } from './queue.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { API_URL } from '@app/api-url';
import { IoClientService } from '@app/core/io-client.service';

describe('QueueService', () => {
  let httpController: HttpTestingController;
  let ioClientServiceStub: jasmine.SpyObj<IoClientService>;

  beforeEach(() => {
    ioClientServiceStub = jasmine.createSpyObj<IoClientService>('IoClientService', [ 'call' ]);
  });

  beforeEach(() => TestBed.configureTestingModule({
    imports: [ HttpClientTestingModule ],
    providers: [
      { provide: API_URL, useValue: 'FAKE_URL' },
      { provide: IoClientService, useValue: ioClientServiceStub },
    ],
  }));

  beforeEach(() => {
    httpController = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    const service: QueueService = TestBed.get(QueueService);
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
      expect(ioClientServiceStub.call).toHaveBeenCalledWith('join queue', { slotId: 11 });
    }));
  });

  describe('#leaveQueue()', () => {
    it('should call the endpoint', inject([QueueService], (service: QueueService) => {
      service.leaveQueue();
      expect(ioClientServiceStub.call).toHaveBeenCalledWith('leave queue');
    }));
  });

  describe('#readyUp()', () => {
    it('should call the endpoint', inject([QueueService], (service: QueueService) => {
      service.readyUp();
      expect(ioClientServiceStub.call).toHaveBeenCalledWith('player ready');
    }));
  });

  describe('#voteForMap()', () => {
    it('should call the endpoint', inject([QueueService], (service: QueueService) => {
      service.voteForMap('cp_fake_rc1');
      expect(ioClientServiceStub.call).toHaveBeenCalledWith('vote for map', { map: 'cp_fake_rc1' });
    }));
  });

  describe('#markFriend()', () => {
    it('should call the endpoint', inject([QueueService], (service: QueueService) => {
      service.markFriend('FAKE_ID');
      expect(ioClientServiceStub.call).toHaveBeenCalledWith('mark friend', { friendPlayerId: 'FAKE_ID' });
    }));
  });
});
