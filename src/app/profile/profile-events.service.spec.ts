import { TestBed } from '@angular/core/testing';

import { ProfileEventsService } from './profile-events.service';

describe('ProfileEventsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProfileEventsService = TestBed.get(ProfileEventsService);
    expect(service).toBeTruthy();
  });
});
