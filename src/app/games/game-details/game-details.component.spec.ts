import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GameDetailsComponent } from './game-details.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { SharedModule } from '@app/shared/shared.module';
import { Store, MemoizedSelector } from '@ngrx/store';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of, NEVER } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { forceEndGame, reinitializeServer, replacePlayer, requestSubstitute } from '../games.actions';
import { NO_ERRORS_SCHEMA, ChangeDetectionStrategy } from '@angular/core';
import { GamesService } from '../games.service';
import { isAdmin } from '@app/profile/profile.selectors';
import { AppState } from '@app/app.state';
import { MockComponent } from 'ng-mocks';
import { GameBasicInfoComponent } from '../game-basic-info/game-basic-info.component';
import { By } from '@angular/platform-browser';
import { JoinGameInfoComponent } from '../join-game-info/join-game-info.component';
import { SoundPlayerService, Sound } from '@app/notifications/sound-player.service';
import { GameSummaryComponent } from '../game-summary/game-summary.component';
import { merge } from 'lodash';
import { WatchGameInfoComponent } from '../watch-game-info/watch-game-info.component';
import { GameTeamHeaderComponent } from '../game-team-header/game-team-header.component';

const paramMap = of(convertToParamMap({ id: 'FAKE_ID' }));

const makeStateWithGame = (overrides?: any) => merge({
  games: {
    ids: ['FAKE_ID'],
    entities: {
      FAKE_ID: {
        id: 'FAKE_ID',
        players: [
          'FAKE_PLAYER_ID_1',
          'FAKE_PLAYER_ID_2'
        ],
        slots: [
          {
            playerId: 'FAKE_PLAYER_ID_1',
            gameClass: 'soldier',
            teamId: '0',
            connectionStatus: 'offline',
            status: 'active',
          },
          {
            playerId: 'FAKE_PLAYER_ID_2',
            gameClass: 'soldier',
            teamId: '1',
            connectionStatus: 'offline',
            status: 'active',
          }
        ],
        map: 'cp_sunshine',
        state: 'launching',
        teams: {
          0: 'RED',
          1: 'BLU'
        },
        launchedAt: new Date('2019-07-25T11:42:55.121Z'),
        number: 3,
        connectString: null,
        error: 'ended by admin',
        mumbleUrl: null,
        gameServer: 'FAKE_GAME_SERVER_ID',
        stvConnectString: null,
      },
    },
    loaded: true,
  },
  profile: {
    id: 'FAKE_PLAYER_ID_1',
    name: 'FAKE_PLAYER_NAME_1',
    bans: [],
  },
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
          status: 'active',
        },
        FAKE_PLAYER_ID_2: {
          id: 'FAKE_PLAYER_ID_2',
          name: 'FAKE_PLAYER_2',
          gameClass: 'soldier',
          status: 'active',
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
}, overrides);

class GamesServiceStub {
  fetchGameSkills(gameId: string) { }
}

class SoundPlayerServiceStub {
  playSound(sound: any) { }
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
      declarations: [
        GameDetailsComponent,
        MockComponent(GameBasicInfoComponent),
        MockComponent(JoinGameInfoComponent),
        MockComponent(GameSummaryComponent),
        MockComponent(WatchGameInfoComponent),
        MockComponent(GameTeamHeaderComponent),
      ],
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
        { provide: SoundPlayerService, useClass: SoundPlayerServiceStub },
      ],
      schemas: [ NO_ERRORS_SCHEMA ],
    })
    // https://github.com/angular/angular/issues/12313
    .overrideComponent(GameDetailsComponent, { set: { changeDetection: ChangeDetectionStrategy.Default } })
    .compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.inject(Store) as MockStore<{}>;
    storeDispatchSpy = spyOn(store, 'dispatch');
    isAdminSelector = store.overrideSelector(isAdmin, false);

    fixture = TestBed.createComponent(GameDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('with game', () => {
    beforeEach(() => {
      store.setState(makeStateWithGame());
      fixture.detectChanges();
    });

    it('should retrieve the game from the store', () => {
      component.game.subscribe(game => expect(game.id).toEqual('FAKE_ID'));
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
        connectionStatus: 'offline',
        status: 'active',
      }] as any));

      component.playersBlu.subscribe(players => expect(players).toEqual([{
        id: 'FAKE_PLAYER_ID_2',
        playerId: 'FAKE_PLAYER_ID_2',
        name: 'FAKE_PLAYER_2',
        gameClass: 'soldier',
        teamId: '1',
        connectionStatus: 'offline',
        status: 'active',
      }] as any));
    });

    it('should fetch skill of each player if the current user is an admin', () => {
      const spy = spyOn(TestBed.inject(GamesService), 'fetchGameSkills').and.returnValue(NEVER);
      isAdminSelector.setResult(true);
      store.refreshState();
      expect(spy).toHaveBeenCalledWith('FAKE_ID');
    });

    describe('#requestSubstitute()', () => {
      it('should dispatch action', () => {
        component.requestSubstitute('FAKE_PLAYER_ID');
        expect(storeDispatchSpy).toHaveBeenCalledWith(requestSubstitute({ gameId: 'FAKE_ID', playerId: 'FAKE_PLAYER_ID' }));
      });
    });

    describe('#replacePlayer()', () => {
      it('should dispatch action', () => {
        component.replacePlayer('FAKE_REPLACEE_ID');
        expect(storeDispatchSpy).toHaveBeenCalledWith(replacePlayer({ gameId: 'FAKE_ID', replaceeId: 'FAKE_REPLACEE_ID' }));
      });
    });

    it('should render game basic info', () => {
      const gameBasicInfo = fixture.debugElement.query(By.css('app-game-basic-info')).componentInstance as GameBasicInfoComponent;
      expect(gameBasicInfo.launchedAt).toEqual(jasmine.any(Date));
      expect(gameBasicInfo.map).toEqual('cp_sunshine');
      expect(gameBasicInfo.gameServerName).toEqual('FAKE_GAME_SERVER_NAME');
      expect(gameBasicInfo.state).toEqual('launching');
    });

    describe('when the current user is part of the game', () => {
      describe('when the connect string is available', () => {
        beforeEach(() => {
          store.setState(makeStateWithGame({ games: { entities: { FAKE_ID: { connectString: 'connect 192.168.1.101:27015; password FAKE_PASSWORD' } } } }));
          fixture.detectChanges();
        });

        it('should pass the connect string to the JoinGameInfoComponent', () => {
          const joinGameInfo = fixture.debugElement.query(By.css('app-join-game-info')).componentInstance as JoinGameInfoComponent;
          expect(joinGameInfo.connectString).toEqual('connect 192.168.1.101:27015; password FAKE_PASSWORD');
        });
      });

      describe('when the mumble url is available', () => {
        beforeEach(() => {
          store.setState(makeStateWithGame({ games: { entities: { FAKE_ID: { mumbleUrl: 'mumble://melkor.tf/tf2pickup/5' } } } }));
          fixture.detectChanges();
        });

        it('should pass the mumble url to the MumbleJoinButtonComponent', () => {
          const mumbleJoinButton = fixture.debugElement.query(By.css('app-join-game-info'))
            .componentInstance as JoinGameInfoComponent;
          expect(mumbleJoinButton.mumbleUrl).toEqual('mumble://FAKE_PLAYER_NAME_1@melkor.tf/tf2pickup/5/RED');
        });
      });
    });

    describe('when the current user is not a part of the game', () => {
      beforeEach(() => {
        store.setState(makeStateWithGame({ profile: { id: 'SOME_OTHER_GUY' } }));
        fixture.detectChanges();
      });

      it('should not render game join info', () => {
        expect(fixture.debugElement.query(By.css('app-join-game-info'))).toBeNull();
      });

      describe('when the stv connect string is available', () => {
        beforeEach(() => {
          store.setState(makeStateWithGame({
            profile: { id: 'SOME_OTHER_GUY' },
            games: {
              entities: {
                FAKE_ID: { stvConnectString: 'connect 192.168.1.101:27020; password tv' },
              },
            },
          }));
          fixture.detectChanges();
        });

        it('should render WatchGameInfoComponent', () => {
          const watchGameInfo = fixture.debugElement.query(By.css('app-watch-game-info')).componentInstance as WatchGameInfoComponent;
          expect(watchGameInfo.stvConnectString).toEqual('connect 192.168.1.101:27020; password tv');
        });
      });
    });

    describe('that has already ended', () => {
      beforeEach(() => {
        store.setState(makeStateWithGame({ games: { entities: { FAKE_ID: { state: 'ended' } } } }));
        fixture.detectChanges();
      });

      it('should not render join game anymore', () => {
        expect(fixture.debugElement.query(By.css('app-join-game-info'))).toBeFalsy();
      });

      it('should render game summary', () => {
        const gameSummary = fixture.debugElement.query(By.css('app-game-summary')).componentInstance as GameSummaryComponent;
        expect(gameSummary).toBeTruthy();
      });
    });

    it('should play a sound when the connect is available', () => {
      const spy = spyOn(TestBed.inject(SoundPlayerService), 'playSound');
      store.setState(makeStateWithGame({ games: { entities: { FAKE_ID: { connectString: 'connect 192.168.1.101:27015; password FAKE_PASSWORD' } } } }));
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledWith(Sound.Fight);
    });

    describe('when the score is defined', () => {
      beforeEach(() => {
        store.setState(makeStateWithGame({ games: { entities: { FAKE_ID: { score: { 0: 3, 1: 5 } } } } }));
        fixture.detectChanges();
      });

      it('should render BLU score', () => {
        const gameTeamHeader = fixture.debugElement.query(By.css('app-game-team-header[team=blu]'))
          .componentInstance as GameTeamHeaderComponent;
        expect(gameTeamHeader.score).toBe(5);
      });

      it('should render RED score', () => {
        const gameTeamHeader = fixture.debugElement.query(By.css('app-game-team-header[team=red]'))
          .componentInstance as GameTeamHeaderComponent;
        expect(gameTeamHeader.score).toBe(3);
      });
    });
  });
});
