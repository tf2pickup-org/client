import { TestBed, inject } from '@angular/core/testing';
import { QueueService } from './queue.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { API_URL } from '@app/api-url';
import { IoClientService } from '@app/core/io-client.service';

class IoClientServiceStub {

}

describe('QueueService', () => {
  let httpController: HttpTestingController;

  beforeEach(() => TestBed.configureTestingModule({
    imports: [ HttpClientTestingModule ],
    providers: [
      { provide: API_URL, useValue: 'FAKE_URL' },
      { provide: IoClientService, useClass: IoClientServiceStub },
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
});
