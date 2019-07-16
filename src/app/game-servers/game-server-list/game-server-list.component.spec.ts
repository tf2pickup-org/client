import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GameServerListComponent } from './game-server-list.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { AppState } from '@app/app.state';
import { Store } from '@ngrx/store';
import { allGameServers } from '../game-servers.selectors';

class BsModalServiceStub {

}

describe('GameServerListComponent', () => {
  let component: GameServerListComponent;
  let fixture: ComponentFixture<GameServerListComponent>;
  let store: MockStore<AppState>;
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
    store.overrideSelector(allGameServers, []);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameServerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
