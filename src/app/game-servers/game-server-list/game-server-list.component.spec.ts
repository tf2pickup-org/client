import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { GameServerListComponent } from './game-server-list.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { AppState } from '@app/app.state';
import { MemoizedSelector } from '@ngrx/store';
import { allGameServers, gameServersLoaded } from '../game-servers.selectors';
import { loadGameServers } from '../game-servers.actions';
import { isSuperUser } from '@app/profile/profile.selectors';
import { By } from '@angular/platform-browser';
import { ChangeDetectionStrategy } from '@angular/core';

describe('GameServerListComponent', () => {
  let component: GameServerListComponent;
  let fixture: ComponentFixture<GameServerListComponent>;
  let store: MockStore<AppState>;
  let allGameServersSelector: MemoizedSelector<AppState, any[]>;
  let isSuperUserSelector: MemoizedSelector<AppState, boolean>;

  beforeEach(
    waitForAsync(() =>
      TestBed.configureTestingModule({
        declarations: [GameServerListComponent],
        providers: [provideMockStore()],
      })
        // https://github.com/angular/angular/issues/12313
        .overrideComponent(GameServerListComponent, {
          set: { changeDetection: ChangeDetectionStrategy.Default },
        })
        .compileComponents(),
    ),
  );

  beforeEach(() => {
    store = TestBed.inject(MockStore);
    spyOn(store, 'dispatch').and.callThrough();

    allGameServersSelector = store.overrideSelector(allGameServers, []);
    isSuperUserSelector = store.overrideSelector(isSuperUser, false);
    store.overrideSelector(gameServersLoaded, false);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameServerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#ngOnInit()', () => {
    it('should load all the game servers', () => {
      component.ngOnInit();
      expect(store.dispatch).toHaveBeenCalledWith(loadGameServers());
    });
  });

  describe('run diagnostics button', () => {
    beforeEach(() => {
      allGameServersSelector.setResult([
        { id: 'FAKE_ID', name: 'some server', isOnline: true },
      ]);
      store.refreshState();
      fixture.detectChanges();
    });

    describe('when the current user is a regular one', () => {
      it('should not be rendered', () => {
        expect(
          fixture.debugElement.query(By.css('.run-diagnostics-button')),
        ).toBeNull();
      });
    });

    describe('when the current user is the super-user', () => {
      let runDiagnosticsButton: HTMLButtonElement;

      beforeEach(() => {
        isSuperUserSelector.setResult(true);
        store.refreshState();
        fixture.detectChanges();

        runDiagnosticsButton = fixture.debugElement.query(
          By.css('.run-diagnostics-button'),
        ).nativeElement as HTMLButtonElement;
      });

      it('should be rendered', () => {
        expect(runDiagnosticsButton).toBeTruthy();
      });
    });
  });
});
