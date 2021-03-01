import { TestBed, fakeAsync, inject, tick } from '@angular/core/testing';
import { PreReadyService } from './pre-ready.service';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { MemoizedSelector, Store } from '@ngrx/store';
import { AppState } from '@app/app.state';
import { isPreReadied } from './queue.selectors';
import { toArray, take } from 'rxjs/operators';
import { stopPreReady } from './queue.actions';

describe('PreReadyService', () => {
  let store: MockStore<AppState>;
  let isPreReadiedSelector: MemoizedSelector<AppState, boolean>;

  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      provideMockStore(),
    ],
  }));

  beforeEach(() => {
    store = TestBed.get(Store);
    isPreReadiedSelector = store.overrideSelector(isPreReadied, false);
  });

  it('should be created', () => {
    const service: PreReadyService = TestBed.get(PreReadyService);
    expect(service).toBeTruthy();
  });

  it('should start', done => fakeAsync(inject([PreReadyService], (service: PreReadyService) => {
    const spy = spyOn(store, 'dispatch');

    service.timeout.pipe(
      take(3),
      toArray(),
    ).subscribe(values => {
      expect(values).toEqual([ 300, 299, 298 ]);
      done();
    });

    isPreReadiedSelector.setResult(true);
    store.refreshState();
    tick(1000 * 301);

    expect(spy).toHaveBeenCalledWith(stopPreReady());
  }))());
});
