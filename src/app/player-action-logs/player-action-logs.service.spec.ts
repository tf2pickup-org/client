import { TestBed } from '@angular/core/testing';

import { PlayerActionLogsService } from './player-action-logs.service';

describe('PlayerActionLogsService', () => {
  let service: PlayerActionLogsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlayerActionLogsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
