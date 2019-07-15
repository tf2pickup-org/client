import { TestBed } from '@angular/core/testing';

import { GamesEventsService } from './games-events.service';

describe('GamesEventsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GamesEventsService = TestBed.get(GamesEventsService);
    expect(service).toBeTruthy();
  });
});
