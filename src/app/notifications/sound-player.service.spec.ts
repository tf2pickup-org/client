import { TestBed } from '@angular/core/testing';
import { SoundPlayerService } from './sound-player.service';

describe('SoundPlayerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SoundPlayerService = TestBed.get(SoundPlayerService);
    expect(service).toBeTruthy();
  });
});
