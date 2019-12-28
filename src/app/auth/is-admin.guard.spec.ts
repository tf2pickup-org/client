import { TestBed, inject } from '@angular/core/testing';
import { IsAdminGuard } from './is-admin.guard';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { AppState } from '@app/app.state';
import { Store, MemoizedSelector } from '@ngrx/store';
import { isAdmin } from '@app/profile/profile.selectors';

describe('IsAdminGuard', () => {
  let store: MockStore<AppState>;
  let isAdminSelector: MemoizedSelector<AppState, boolean>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        IsAdminGuard,
        provideMockStore(),
      ]
    });

    store = TestBed.get(Store);
    isAdminSelector = store.overrideSelector(isAdmin, false);
  });

  it('should be created', inject([IsAdminGuard], (guard: IsAdminGuard) => {
    expect(guard).toBeTruthy();
  }));

  describe('#canActivate()', () => {
    it('should return false', inject([IsAdminGuard], (guard: IsAdminGuard) => {
      guard.canActivate().subscribe(value => expect(value).toBe(false));
    }));

    it('should return true', inject([IsAdminGuard], (guard: IsAdminGuard) => {
      isAdminSelector.setResult(true);
      store.refreshState();
      guard.canActivate().subscribe(value => expect(value).toBe(true));
    }));
  });
});
