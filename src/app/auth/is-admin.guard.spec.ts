import { TestBed, inject } from '@angular/core/testing';
import { IsAdminGuard } from './is-admin.guard';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { AppState } from '@app/app.state';
import { MemoizedSelector } from '@ngrx/store';
import { profile } from '@app/profile/profile.selectors';
import { ProfileState } from '@app/profile/profile.reducer';
import { Player } from '@app/players/models/player';

describe('IsAdminGuard', () => {
  let store: MockStore<AppState>;
  let profileSelector: MemoizedSelector<AppState, ProfileState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IsAdminGuard, provideMockStore()],
    });

    store = TestBed.inject(MockStore);
    profileSelector = store.overrideSelector(profile, {
      authenticated: 'unknown',
    });
  });

  afterEach(() => TestBed.inject(MockStore)?.resetSelectors());

  it('should be created', inject([IsAdminGuard], (guard: IsAdminGuard) => {
    expect(guard).toBeTruthy();
  }));

  describe('#canActivate()', () => {
    describe('when the user is not logged in', () => {
      beforeEach(() => {
        profileSelector.setResult({ authenticated: 'not authenticated' });
        store.refreshState();
      });

      it('should return false', inject(
        [IsAdminGuard],
        (guard: IsAdminGuard) => {
          guard.canActivate().subscribe(value => expect(value).toBe(false));
        },
      ));
    });

    describe('when the user is not an admin', () => {
      beforeEach(() => {
        profileSelector.setResult({
          authenticated: 'authenticated',
          player: { roles: [] } as Player,
        } as ProfileState);
        store.refreshState();
      });

      it('should return false', inject(
        [IsAdminGuard],
        (guard: IsAdminGuard) => {
          guard.canActivate().subscribe(value => expect(value).toBe(false));
        },
      ));
    });

    describe('when the user is an admin', () => {
      beforeEach(() => {
        profileSelector.setResult({
          authenticated: 'authenticated',
          player: { roles: ['admin'] } as Player,
        } as ProfileState);
        store.refreshState();
      });

      it('should return true', inject([IsAdminGuard], (guard: IsAdminGuard) => {
        guard.canActivate().subscribe(value => expect(value).toBe(true));
      }));
    });
  });
});
