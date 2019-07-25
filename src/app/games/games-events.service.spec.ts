import { TestBed } from '@angular/core/testing';
import { GamesEventsService } from './games-events.service';
import { EventEmitter } from 'events';
import { IoClientService } from '@app/core/io-client.service';

class IoClientServiceStub  {
  socket = new EventEmitter();
}

describe('GamesEventsService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      { provide: IoClientService, useClass: IoClientServiceStub },
    ]
  }));

  it('should be created', () => {
    const service: GamesEventsService = TestBed.get(GamesEventsService);
    expect(service).toBeTruthy();
  });
});
