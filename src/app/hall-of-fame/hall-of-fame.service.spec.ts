import { TestBed } from '@angular/core/testing';

import { HallOfFameService } from './hall-of-fame.service';

describe('HallOfFameService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HallOfFameService = TestBed.get(HallOfFameService);
    expect(service).toBeTruthy();
  });
});
