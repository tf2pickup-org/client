import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GameServerListComponent } from './game-server-list.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { AppState } from '@app/app.state';
import { Store } from '@ngrx/store';
import { allGameServers } from '../game-servers.selectors';
import { removeGameServer, loadGameServer, loadGameServers } from '../game-servers.actions';

class BsModalServiceStub {
  show() { }
}

describe('GameServerListComponent', () => {
  let component: GameServerListComponent;
  let fixture: ComponentFixture<GameServerListComponent>;
  let store: MockStore<AppState>;
  let bsModalService: BsModalServiceStub;
  let storeDispatchSpy: jasmine.Spy;

  const initialState = {
    profile: { },
    gameServers: {
      locked: false,
      loaded: false,
    },
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameServerListComponent ],
      providers: [
        { provide: BsModalService, useClass: BsModalServiceStub },
        provideMockStore({ initialState }),
      ]
    })
    .compileComponents();

    store = TestBed.get(Store);
    storeDispatchSpy = spyOn(store, 'dispatch').and.callThrough();
    store.overrideSelector(allGameServers, []);
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
});
