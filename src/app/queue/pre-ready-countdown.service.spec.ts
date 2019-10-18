import { TestBed } from '@angular/core/testing';
import { PreReadyCountdownService } from './pre-ready-countdown.service';
import { provideMockStore } from '@ngrx/store/testing';

describe('PreReadyCountdownService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      provideMockStore(),
    ],
  }));

  it('should be created', () => {
    const service: PreReadyCountdownService = TestBed.get(PreReadyCountdownService);
    expect(service).toBeTruthy();
  });
});
