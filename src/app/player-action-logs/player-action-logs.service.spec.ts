import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { API_URL } from '@app/api-url';
import { PlayerActionLogsService } from './player-action-logs.service';

describe('PlayerActionLogsService', () => {
  let service: PlayerActionLogsService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: API_URL, useValue: 'FAKE_URL' }],
    });
    service = TestBed.inject(PlayerActionLogsService);
    httpController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#fetchPlayerActions()', () => {
    it('should query the endpoint', () => {
      service
        .fetchPlayerActions({
          limit: 42,
          filter: {
            ipAddress: '127.0.0.1',
            'player.name': 'FAKE_PLAYER_NAME',
          },
        })
        .subscribe();

      httpController.expectOne(
        'FAKE_URL/player-action-logs?limit=42&filter%5BipAddress%5D=127.0.0.1&filter%5Bplayer.name%5D=FAKE_PLAYER_NAME',
      );
      expect().nothing();
    });
  });
});
