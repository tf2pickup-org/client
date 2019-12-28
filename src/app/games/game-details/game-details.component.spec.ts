import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GameDetailsComponent } from './game-details.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { SharedModule } from '@app/shared/shared.module';
import { Store, MemoizedSelector } from '@ngrx/store';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of, NEVER } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { loadGame, forceEndGame, reinitializeServer } from '../games.actions';
import { Game } from '../models/game';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { GamesService } from '../games.service';
import { isAdmin } from '@app/profile/profile.selectors';
import { AppState } from '@app/app.state';

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
  mumbleUrl: 'mumble://FAKE_MUMBLE_URL/FAKE_CHANNEL',
  gameServer: 'FAKE_GAME_SERVER_ID',
};

class GamesServiceStub {
  fetchGameSkills(gameId: string) { }
}

describe('GameDetailsComponent', () => {
  let component: GameDetailsComponent;
  let fixture: ComponentFixture<GameDetailsComponent>;
  let store: MockStore<any>;
  let storeDispatchSpy: jasmine.Spy;
  let isAdminSelector: MemoizedSelector<AppState, boolean>;

  const initialState = { games: { ids: [], entities: { }, loaded: false } };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameDetailsComponent ],
      imports: [
        RouterTestingModule,
        SharedModule,
      ],
      providers: [
        provideMockStore({
          initialState,
        }),
        { provide: ActivatedRoute, useValue: { paramMap } },
        { provide: GamesService, useClass: GamesServiceStub  },
      ],
      schemas: [ NO_ERRORS_SCHEMA ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.get(Store);
    storeDispatchSpy = spyOn(store, 'dispatch');
    isAdminSelector = store.overrideSelector(isAdmin, false);

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

  describe('with game', () => {
    beforeEach(() => {
      store.setState({
        games: {
          ids: ['FAKE_ID'],
          entities: { FAKE_ID: theGame },
          loaded: true,
        },
        profile: { profile: { id: 'FAKE_PROFILE_ID' } },
        players: {
          players: {
            ids: [
              'FAKE_PLAYER_ID_1',
              'FAKE_PLAYER_ID_2',
            ],
            entities: {
              FAKE_PLAYER_ID_1: {
                id: 'FAKE_PLAYER_ID_1',
                name: 'FAKE_PLAYER_1',
                gameClass: 'soldier',
              },
              FAKE_PLAYER_ID_2: {
                id: 'FAKE_PLAYER_ID_2',
                name: 'FAKE_PLAYER_2',
                gameClass: 'soldier',
              },
            },
          },
        },
        gameServers: {
          ids: ['FAKE_GAME_SERVER_ID'],
          entities: {
            FAKE_GAME_SERVER_ID: { id: 'FAKE_GAME_SERVER_ID', name: 'FAKE_GAME_SERVER_NAME' },
          },
        },
      });
      fixture.detectChanges();
    });

    it('should retrieve the game from the store', () => {
      component.game.subscribe(game => expect(game).toEqual(theGame));
    });

    it('should retrieve the game server name', () => {
      component.gameServerName.subscribe(name => expect(name).toEqual('FAKE_GAME_SERVER_NAME'));
    });

    describe('#reinitializeServer()', () => {
      it('should dispatch the reinitializeServer action', () => {
        component.reinitializeServer();
        expect(storeDispatchSpy).toHaveBeenCalledWith(reinitializeServer({ gameId: 'FAKE_ID' }));
      });
    });

    describe('#forceEndGame()', () => {
      it('should dispatch the forceEndGame action', () => {
        component.forceEndGame();
        expect(storeDispatchSpy).toHaveBeenCalledWith(forceEndGame({ gameId: 'FAKE_ID' }));
      });
    });

    it('should retrieve players of each team', () => {
      component.playersRed.subscribe(players => expect(players).toEqual([{
        id: 'FAKE_PLAYER_ID_1',
        playerId: 'FAKE_PLAYER_ID_1',
        name: 'FAKE_PLAYER_1',
        gameClass: 'soldier',
        teamId: '0',
      }] as any));

      component.playersBlu.subscribe(players => expect(players).toEqual([{
        id: 'FAKE_PLAYER_ID_2',
        playerId: 'FAKE_PLAYER_ID_2',
        name: 'FAKE_PLAYER_2',
        gameClass: 'soldier',
        teamId: '1',
      }] as any));
    });

    it('should fetch skill of each player if the current user is an admin', () => {
      const spy = spyOn(TestBed.get(GamesService), 'fetchGameSkills').and.returnValue(NEVER);
      isAdminSelector.setResult(true);
      store.refreshState();
      expect(spy).toHaveBeenCalledWith('FAKE_ID');
    });
  });
});
