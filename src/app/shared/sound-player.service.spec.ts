import { TestBed } from '@angular/core/testing';

import { SoundPlayerService } from './sound-player.service';

describe('SoundPlayerService', () => {
  let service: SoundPlayerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SoundPlayerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
