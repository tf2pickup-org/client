import { TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TablerIconComponent } from 'angular-tabler-icons';
import {
  MockBuilder,
  MockedComponentFixture,
  MockRender,
  ngMocks,
} from 'ng-mocks';
import { Subject } from 'rxjs';
import { preferencesUpdated, savePreferences } from '../profile.actions';
import { preferences } from '../profile.selectors';
import { PlayerPreferencesComponent } from './player-preferences.component';

describe(PlayerPreferencesComponent.name, () => {
  let component: PlayerPreferencesComponent;
  let fixture: MockedComponentFixture<PlayerPreferencesComponent>;
  let store: MockStore;
  let actions: Subject<unknown>;
  let submitButton: HTMLButtonElement;
  let volumeSlider: HTMLInputElement;

  beforeEach(() => {
    actions = new Subject();
  });

  beforeEach(() =>
    MockBuilder(PlayerPreferencesComponent)
      .keep(ReactiveFormsModule)
      .keep(FormBuilder)
      .provide(
        provideMockStore({
          selectors: [{ selector: preferences, value: { soundVolume: '0.5' } }],
        }),
      )
      .provide(provideMockActions(() => actions.asObservable()))
      .mock(TablerIconComponent),
  );

  beforeEach(() => {
    fixture = MockRender(PlayerPreferencesComponent);
    component = fixture.point.componentInstance;
    fixture.detectChanges();

    submitButton = ngMocks.find('button[type=submit]').nativeElement;
    volumeSlider = ngMocks.find('input[type=range]').nativeElement;
    store = TestBed.inject(MockStore);
    spyOn(store, 'dispatch');
  });

  afterEach(() => TestBed.inject(MockStore)?.resetSelectors());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the values', () => {
    expect(volumeSlider.value).toEqual('0.5');
  });

  it('should disable the submit button', () => {
    expect(submitButton.disabled).toBe(true);
  });

  describe('when changed', () => {
    beforeEach(() => {
      volumeSlider.value = '0.7';
      volumeSlider.dispatchEvent(new Event('input'));
      fixture.detectChanges();
    });

    it('should enable the submit button', () => {
      expect(submitButton.disabled).toBe(false);
    });

    describe('when submitted', () => {
      beforeEach(() => {
        submitButton.click();
        fixture.detectChanges();
      });

      it('should dispatch savePreferences action', () => {
        expect(store.dispatch).toHaveBeenCalledWith(
          savePreferences({ preferences: { soundVolume: '0.7' } }),
        );
      });

      it('should disable the submit button', () => {
        expect(submitButton.disabled).toBe(true);
      });

      describe('when saved', () => {
        beforeEach(() => {
          actions.next(
            preferencesUpdated({ preferences: { soundVolume: '0.7' } }),
          );
          fixture.detectChanges();
        });

        it('should keep the submit button disabled', () => {
          expect(submitButton.disabled).toBe(true);
        });

        describe('and edited again', () => {
          beforeEach(() => {
            volumeSlider.value = '0.9';
            volumeSlider.dispatchEvent(new Event('input'));
            fixture.detectChanges();
          });

          it('should enable the submit button', () => {
            expect(submitButton.disabled).toBe(false);
          });
        });
      });
    });
  });
});
