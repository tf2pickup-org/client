import { TestBed } from '@angular/core/testing';

import { PreReadyCountdownService } from './pre-ready-countdown.service';

describe('PreReadyCountdownService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PreReadyCountdownService = TestBed.get(PreReadyCountdownService);
    expect(service).toBeTruthy();
  });
});
