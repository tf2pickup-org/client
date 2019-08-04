import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PlayerDetailsComponent } from './player-details.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { PlayersService } from '../players.service';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { convertToParamMap, ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { loadPlayer } from '../players.actions';

class BsModalServiceStub {

}

class PlayersServiceStub {
  fetchPlayerGames() { }
}

class RouterStub {
  navigate(params: string[]) { }
}

const paramMap = of(convertToParamMap({ id: 'FAKE_ID' }));

describe('PlayerDetailsComponent', () => {
  let component: PlayerDetailsComponent;
  let fixture: ComponentFixture<PlayerDetailsComponent>;
  let store: MockStore<any>;
  let storeDispatchSpy: jasmine.Spy;

  const initialState = { players: { ids: [], entities: { } } };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayerDetailsComponent ],
      imports: [
        RouterTestingModule,
      ],
      providers: [
        { provide: BsModalService, useClass: BsModalServiceStub },
        { provide: PlayersService, useClass: PlayersServiceStub  },
        provideMockStore({ initialState }),
        { provide: ActivatedRoute, useValue: { paramMap } },
        { provide: Router, useClass: RouterStub },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.get(Store);
    storeDispatchSpy = spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(PlayerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load the player if it is not in the store yet', () => {
    expect(storeDispatchSpy).toHaveBeenCalledWith(loadPlayer({ playerId: 'FAKE_ID' }));
  });

  describe('#editPlayer()', () => {
    it('redirects to edit player page', () => {
      store.setState({ players: { ids: [ 'FAKE_ID' ], entities: { FAKE_ID: { id: 'FAKE_ID' } } } });
      const spy = spyOn(TestBed.get(Router), 'navigate');
      component.editPlayer();
      expect(spy).toHaveBeenCalledWith(['/player', 'FAKE_ID', 'edit']);
    });
  });
});
