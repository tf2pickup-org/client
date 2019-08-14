import { TestBed, async } from '@angular/core/testing';
import { ProfileEventsService } from './profile-events.service';
import { of } from 'rxjs';
import { EventEmitter } from 'events';
import { IoClientService } from '@app/core/io-client.service';

class IoClientServiceStub  {
  socket = of(new EventEmitter());
}

describe('ProfileEventsService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      { provide: IoClientService, useClass: IoClientServiceStub },
    ],
  }));

  it('should be created', () => {
    const service: ProfileEventsService = TestBed.get(ProfileEventsService);
    expect(service).toBeTruthy();
  });

  describe('io event forwared', () => {
    let service: ProfileEventsService;
    let ioClientService: IoClientServiceStub;

    beforeEach(() => {
      service = TestBed.get(ProfileEventsService);
      ioClientService = TestBed.get(IoClientService);
    });

    it('should forward profile update', async(() => {
      const update = { name: 'FAKE_PROFILE_NAME' };
      service.profileUpdated.subscribe(event => expect(event).toEqual(update));
      ioClientService.socket.subscribe(socket => socket.emit('profile update', update));
    }));
  });
});
