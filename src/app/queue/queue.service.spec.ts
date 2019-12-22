import { TestBed, inject } from '@angular/core/testing';
import { QueueService } from './queue.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { API_URL } from '@app/api-url';
import { IoClientService } from '@app/core/io-client.service';

class IoClientServiceStub {
  call(methodName: string, ...args: any[]) { }
}

describe('QueueService', () => {
  let httpController: HttpTestingController;
  let ioClientService: IoClientServiceStub;

  beforeEach(() => TestBed.configureTestingModule({
    imports: [ HttpClientTestingModule ],
    providers: [
      { provide: API_URL, useValue: 'FAKE_URL' },
      { provide: IoClientService, useClass: IoClientServiceStub },
    ],
  }));

  beforeEach(() => {
    httpController = TestBed.get(HttpTestingController);
    ioClientService = TestBed.get(IoClientService);
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
      const spy = spyOn(ioClientService, 'call');
      service.joinQueue(11);
      expect(spy).toHaveBeenCalledWith('join queue', { slotId: 11 });
    }));
  });

  describe('#leaveQueue()', () => {
    it('should call the endpoint', inject([QueueService], (service: QueueService) => {
      const spy = spyOn(ioClientService, 'call');
      service.leaveQueue();
      expect(spy).toHaveBeenCalledWith('leave queue');
    }));
  });

  describe('#readyUp()', () => {
    it('should call the endpoint', inject([QueueService], (service: QueueService) => {
      const spy = spyOn(ioClientService, 'call');
      service.readyUp();
      expect(spy).toHaveBeenCalledWith('player ready');
    }));
  });

  describe('#voteForMap()', () => {
    it('should call the endpoint', inject([QueueService], (service: QueueService) => {
      const spy = spyOn(ioClientService, 'call');
      service.voteForMap('cp_fake_rc1');
      expect(spy).toHaveBeenCalledWith('vote for map', 'cp_fake_rc1');
    }));
  });

  describe('#markFriend()', () => {
    it('should call the endpoint', inject([QueueService], (service: QueueService) => {
      const spy = spyOn(ioClientService, 'call');
      service.markFriend('FAKE_ID');
      expect(spy).toHaveBeenCalledWith('mark friend', 'FAKE_ID');
    }));
  });
});
