import { TestBed } from '@angular/core/testing';
import { PreReadyService } from './pre-ready.service';

describe('PreReadyService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PreReadyService = TestBed.get(PreReadyService);
    expect(service).toBeTruthy();
  });
});
