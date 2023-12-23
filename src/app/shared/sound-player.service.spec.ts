import { TestBed } from '@angular/core/testing';
import { AppState } from '@app/app.state';
import { PlayerPreferences } from '@app/profile/models/player-preferences';
import { preferences } from '@app/profile/profile.selectors';
import { MemoizedSelector } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Howl } from 'howler';
import { SoundPlayerService } from './sound-player.service';

describe(SoundPlayerService.name, () => {
  let service: SoundPlayerService;
  let store: MockStore;
  let preferencesSelector: MemoizedSelector<AppState, PlayerPreferences>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore()],
    });

    service = TestBed.inject(SoundPlayerService);
    store = TestBed.inject(MockStore);
    preferencesSelector = store.overrideSelector(preferences, null);
  });

  beforeEach(() => {
    // @ts-expect-error init is not visible by ts
    spyOn(Howl.prototype, 'init');
    spyOn(Howl.prototype, 'stop');
  });

  afterEach(() => TestBed.inject(MockStore)?.resetSelectors());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#playSound()', () => {
    it('should autoplay the sound', () => {
      service.playSound(['sound.wav']).subscribe();
      // @ts-expect-error init is not visible by ts
      expect(Howl.prototype.init).toHaveBeenCalledOnceWith(
        jasmine.objectContaining({
          autoplay: true,
        }),
      );
    });

    describe('when unsubscribed', () => {
      it('should stop', () => {
        service.playSound(['sound.wav']).subscribe().unsubscribe();
        expect(Howl.prototype.stop).toHaveBeenCalled();
      });
    });

    describe('when preferences are null', () => {
      it('should set the volume to 1', () => {
        service.playSound(['sound.wav']).subscribe();
        // @ts-expect-error init is not visible by ts
        expect(Howl.prototype.init).toHaveBeenCalledOnceWith(
          jasmine.objectContaining({
            volume: 1.0,
          }),
        );
      });
    });

    describe('when the volume is not set', () => {
      beforeEach(() => {
        preferencesSelector.setResult({});
        store.refreshState();
      });

      it('should set the volume to 1', () => {
        service.playSound(['sound.wav']).subscribe();
        // @ts-expect-error init is not visible by ts
        expect(Howl.prototype.init).toHaveBeenCalledOnceWith(
          jasmine.objectContaining({
            volume: 1.0,
          }),
        );
      });
    });

    describe('wheh the volume is set', () => {
      beforeEach(() => {
        preferencesSelector.setResult({ soundVolume: '0.5' });
        store.refreshState();
      });

      it('should respect the preference', () => {
        service.playSound(['sound.wav']).subscribe();
        // @ts-expect-error init is not visible by ts
        expect(Howl.prototype.init).toHaveBeenCalledOnceWith(
          jasmine.objectContaining({
            volume: 0.5,
          }),
        );
      });
    });
  });
});
