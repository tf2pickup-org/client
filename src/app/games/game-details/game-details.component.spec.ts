import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GameDetailsComponent } from './game-details.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { SharedModule } from '@app/shared/shared.module';
import { Store } from '@ngrx/store';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { loadGame } from '../games.actions';
import { Game } from '../models/game';

const paramMap = of(convertToParamMap({ id: 'FAKE_ID' }));
const theGame: Game = {
  id: 'FAKE_ID',
  players: [
    'FAKE_PLAYER_ID_1',
    'FAKE_PLAYER_ID_2'
  ],
  slots: [
    {
      playerId: 'FAKE_PLAYER_ID_1',
      gameClass: 'soldier',
      teamId: '0'
    },
    {
      playerId: 'FAKE_PLAYER_ID_2',
      gameClass: 'soldier',
      teamId: '1'
    }
  ],
  map: 'cp_sunshine',
  state: 'interrupted',
  teams: {
    0: 'RED',
    1: 'BLU'
  },
  launchedAt: new Date('2019-07-25T11:42:55.121Z'),
  number: 3,
  connectString: 'connect 192.168.1.101:27015; password FAKE_PASSWORD',
  error: 'ended by admin',
};

describe('GameDetailsComponent', () => {
  let component: GameDetailsComponent;
  let fixture: ComponentFixture<GameDetailsComponent>;
  let store: MockStore<any>;
  let storeDispatchSpy: jasmine.Spy;

  const initialState = { games: { ids: [], entities: { }, loaded: false } };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameDetailsComponent ],
      imports: [
        RouterTestingModule,
        SharedModule,
      ],
      providers: [
        provideMockStore({ initialState }),
        { provide: ActivatedRoute, useValue: { paramMap } },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.get(Store);
    storeDispatchSpy = spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(GameDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load the game if it is not in the store yet', () => {
    expect(storeDispatchSpy).toHaveBeenCalledWith(loadGame({ gameId: 'FAKE_ID' }));
  });

  it('should retrieve the game from the store', async(() => {
    store.setState({
      games: {
        ids: ['FAKE_ID'],
        entities: { FAKE_ID: theGame },
        loaded: true,
      },
    });

    component.game.subscribe(game => expect(game).toEqual(theGame));
  }));

  it('should retrieve players of each team');
});
