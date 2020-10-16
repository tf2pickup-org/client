import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { GameServerListComponent } from './game-server-list.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { AppState } from '@app/app.state';
import { MemoizedSelector } from '@ngrx/store';
import { allGameServers, gameServersLoaded } from '../game-servers.selectors';
import { removeGameServer, loadGameServers } from '../game-servers.actions';
import { isSuperUser } from '@app/profile/profile.selectors';
import { By } from '@angular/platform-browser';
import { ChangeDetectionStrategy } from '@angular/core';

describe('GameServerListComponent', () => {
  let component: GameServerListComponent;
  let fixture: ComponentFixture<GameServerListComponent>;
  let store: MockStore<AppState>;
  let storeDispatchSpy: jasmine.Spy;
  let allGameServersSelector: MemoizedSelector<AppState, any[]>;
  let isSuperUserSelector: MemoizedSelector<AppState, boolean>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GameServerListComponent ],
      providers: [
        provideMockStore(),
      ]
    })
    // https://github.com/angular/angular/issues/12313
    .overrideComponent(GameServerListComponent, { set: { changeDetection: ChangeDetectionStrategy.Default } })
    .compileComponents();

    store = TestBed.inject(MockStore);
    storeDispatchSpy = spyOn(store, 'dispatch').and.callThrough();
    allGameServersSelector = store.overrideSelector(allGameServers, []);
    isSuperUserSelector = store.overrideSelector(isSuperUser, false);
    store.overrideSelector(gameServersLoaded, false);
  }));

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
      expect(storeDispatchSpy).toHaveBeenCalledWith(loadGameServers());
    });
  });

  describe('remove button', () => {
    beforeEach(() => {
      allGameServersSelector.setResult([ { id: 'FAKE_ID', name: 'some server', isOnline: true } ]);
      store.refreshState();
      fixture.detectChanges();
    });

    describe('when the current user is a regular one', () => {
      it('should not be rendered', () => {
        expect(fixture.debugElement.query(By.css('.remove-game-server-btn'))).toBeNull();
      });
    });

    describe('when the current user is the super-user', () => {
      let removeGameServerButton: HTMLButtonElement;

      beforeEach(() => {
        isSuperUserSelector.setResult(true);
        store.refreshState();
        fixture.detectChanges();

        removeGameServerButton = fixture.debugElement.query(By.css('.remove-game-server-button')).nativeElement as HTMLButtonElement;
      });

      it('should be rendered', () => {
        expect(removeGameServerButton).toBeTruthy();
      });

      it('should dispatch an action', () => {
        removeGameServerButton.click();
        expect(storeDispatchSpy).toHaveBeenCalledWith(removeGameServer({ gameServerId: 'FAKE_ID' }));
      });
    });
  });

  describe('add button', () => {
    describe('when the current user is a regular one', () => {
      it('should not be rendered for a regular user', () => {
        expect(fixture.debugElement.query(By.css('.add-game-server-button'))).toBeNull();
      });
    });

    describe('when the current user is the super-user', () => {
      let addGameServerButton: HTMLAnchorElement;

      beforeEach(() => {
        isSuperUserSelector.setResult(true);
        store.refreshState();
        fixture.detectChanges();

        addGameServerButton = fixture.debugElement.query(By.css('.add-game-server-button')).nativeElement as HTMLAnchorElement;
      });

      it('should be rendered', () => {
        expect(addGameServerButton).toBeTruthy();
      });
    });
  });
});
