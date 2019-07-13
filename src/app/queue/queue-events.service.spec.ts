import { TestBed } from '@angular/core/testing';

import { QueueEventsService } from './queue-events.service';

describe('QueueEventsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: QueueEventsService = TestBed.get(QueueEventsService);
    expect(service).toBeTruthy();
  });
});
