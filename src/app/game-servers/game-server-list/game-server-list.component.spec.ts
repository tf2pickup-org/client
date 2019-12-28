import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GameServerListComponent } from './game-server-list.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { AppState } from '@app/app.state';
import { Store, MemoizedSelector } from '@ngrx/store';
import { allGameServers, gameServersLocked, gameServersLoaded } from '../game-servers.selectors';
import { removeGameServer, loadGameServers } from '../game-servers.actions';
import { isSuperUser } from '@app/profile/profile.selectors';
import { By } from '@angular/platform-browser';
import { ChangeDetectionStrategy } from '@angular/core';

class BsModalServiceStub {
  show() { }
}

describe('GameServerListComponent', () => {
  let component: GameServerListComponent;
  let fixture: ComponentFixture<GameServerListComponent>;
  let store: MockStore<AppState>;
  let bsModalService: BsModalServiceStub;
  let storeDispatchSpy: jasmine.Spy;
  let allGameServersSelector: MemoizedSelector<AppState, any[]>;
  let isSuperUserSelector: MemoizedSelector<AppState, boolean>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameServerListComponent ],
      providers: [
        { provide: BsModalService, useClass: BsModalServiceStub },
        provideMockStore(),
      ]
    })
    // https://github.com/angular/angular/issues/12313
    .overrideComponent(GameServerListComponent, { set: { changeDetection: ChangeDetectionStrategy.Default } })
    .compileComponents();

    store = TestBed.get(Store);
    storeDispatchSpy = spyOn(store, 'dispatch').and.callThrough();
    allGameServersSelector = store.overrideSelector(allGameServers, []);
    isSuperUserSelector = store.overrideSelector(isSuperUser, false);
    store.overrideSelector(gameServersLocked, false);
    store.overrideSelector(gameServersLoaded, false);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameServerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    bsModalService = TestBed.get(BsModalService);
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

  describe('#addGameServer()', () => {
    it('should open the modal dialog', () => {
      const spy = spyOn(bsModalService, 'show');
      component.addGameServer();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('#removeGameServer()', () => {
    it('should dispatch an action', () => {
      component.removeGameServer({ id: 'FAKE_ID' } as any);
      expect(storeDispatchSpy).toHaveBeenCalledWith(removeGameServer({ gameServerId: 'FAKE_ID' }));
    });
  });

  describe('remove button', () => {
    beforeEach(() => {
      allGameServersSelector.setResult([ { id: '1', name: 'some server', isOnline: true } ]);
      store.refreshState();
      fixture.detectChanges();
    });

    it('should not be rendered for regular user', () => {
      expect(fixture.debugElement.query(By.css('.remove-game-server-btn'))).toBeNull();
    });

    it('should be rendered for super-user', () => {
      isSuperUserSelector.setResult(true);
      store.refreshState();
      fixture.detectChanges();

      const btn = fixture.debugElement.query(By.css('.remove-game-server-btn')).nativeElement as HTMLButtonElement;
      expect(btn).toBeTruthy();
      expect(btn.disabled).toBeFalse();
    });
  });

  describe('add button', () => {
    it('should not be rendered for a regular user', () => {
      expect(fixture.debugElement.query(By.css('.add-game-server-btn'))).toBeNull();
    });

    it('should be visible for super-user', () => {
      isSuperUserSelector.setResult(true);
      store.refreshState();
      fixture.detectChanges();

      const btn = fixture.debugElement.query(By.css('.add-game-server-btn')).nativeElement as HTMLButtonElement;
      expect(btn).toBeTruthy();
      expect(btn.disabled).toBeFalse();
    });
  });
});
