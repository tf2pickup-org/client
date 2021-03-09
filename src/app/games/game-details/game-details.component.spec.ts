/* eslint-disable id-blacklist */
/* eslint-disable @typescript-eslint/naming-convention */
import { TestBed } from '@angular/core/testing';
import { GameDetailsComponent } from './game-details.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of, Subject } from 'rxjs';
import { MockBuilder, MockedComponentFixture, MockRender, ngMocks } from 'ng-mocks';
import { GameBasicInfoComponent } from '../game-basic-info/game-basic-info.component';
import { Title } from '@angular/platform-browser';
import { GameSummaryComponent } from '../game-summary/game-summary.component';
import { GameTeamHeaderComponent } from '../game-team-header/game-team-header.component';
import { GameTeamPlayerListComponent } from '../game-team-player-list/game-team-player-list.component';
import { Game } from '../models/game';
import { map } from 'rxjs/operators';
import { isAdmin, isBanned, isLoggedIn, profile } from '@app/profile/profile.selectors';
import { activeGame } from '../games.selectors';
import { GameServer } from '@app/game-servers/models/game-server';
import { ConnectStringComponent } from '../connect-string/connect-string.component';
import { GameAdminButtonsComponent } from '../game-admin-buttons/game-admin-buttons.component';
import { MumbleJoinButtonComponent } from '../mumble-join-button/mumble-join-button.component';
import { forceEndGame, loadGame, reinitializeServer, replacePlayer, requestSubstitute } from '../games.actions';
import { Profile } from '@app/profile/models/profile';
import { keyBy } from 'lodash-es';
import { loadGameServer } from '@app/game-servers/game-servers.actions';
import { Player } from '@app/players/models/player';
import { GamesService } from '../games.service';
import { SoundPlayerService } from '@app/shared/sound-player.service';

const gameInProgress: Game = {
  id: 'FAKE_GAME_ID',
  map: 'cp_sunshine',
  state: 'launching',
  launchedAt: new Date('2019-07-25T11:42:55.121Z'),
  number: 3,
  gameServer: 'FAKE_GAME_SERVER_ID',
  connectString: 'FAKE_CONNECT_STRING',
  stvConnectString: 'FAKE_STV_CONNECT_STRING',
  mumbleUrl: 'mumble://melkor.tf/tf2pickup/5',
  slots: [
    {
      player: 'FAKE_PLAYER_1_ID',
      gameClass: 'soldier',
      team: 'red',
      connectionStatus: 'offline',
      status: 'active',
    },
    {
      player: 'FAKE_PLAYER_2_ID',
      gameClass: 'soldier',
      team: 'blu',
      connectionStatus: 'offline',
      status: 'active',
    }
  ],
};

const endedGame: Game = {
  id: 'FAKE_GAME_ID',
  map: 'cp_sunshine',
  state: 'ended',
  launchedAt: new Date('2019-07-25T11:42:55.121Z'),
  number: 3,
  gameServer: 'FAKE_GAME_SERVER_ID',
  slots: [
    {
      player: 'FAKE_PLAYER_1_ID',
      gameClass: 'soldier',
      team: 'red',
      connectionStatus: 'offline',
      status: 'active',
    },
    {
      player: 'FAKE_PLAYER_2_ID',
      gameClass: 'soldier',
      team: 'blu',
      connectionStatus: 'offline',
      status: 'active',
    },
  ],
  logsUrl: 'FAKE_LOGS_URL',
  demoUrl: 'FAKE_DEMO_URL',
  score: {
    red: 2,
    blu: 1,
  },
};

const mockGameServer: GameServer = {
  id: 'FAKE_GAME_SERVER_ID',
  name: 'FAKE_GAME_SERVER',
  address: 'FAKE_ADDRESS',
  port: '12345',
};

const mockPlayers = [
  {
    id: 'FAKE_PLAYER_1_ID',
    name: 'FAKE_PLAYER_1',
    joinedAt: new Date('2019-08-01T13:42:55.121Z'),
    steamId: 'FAKE_PLAYER_1_STEAM_ID',
    avatar: {
      small: 'FAKE_PLAYER_1_SMALL_AVATAR_URL',
      medium: 'FAKE_PLAYER_1_MEDIUM_AVATAR_URL',
      large: 'FAKE_PLAYER_1_LARGE_AVATAR_URL',
    },
  },
  {
    id: 'FAKE_PLAYER_2_ID',
    name: 'FAKE_PLAYER_2',
    joinedAt: new Date('2019-08-01T13:42:55.121Z'),
    steamId: 'FAKE_PLAYER_2_STEAM_ID',
    avatar: {
      small: 'FAKE_PLAYER_2_SMALL_AVATAR_URL',
      medium: 'FAKE_PLAYER_2_MEDIUM_AVATAR_URL',
      large: 'FAKE_PLAYER_2_LARGE_AVATAR_URL',
    },
  },
];

const makeState = (games: Game[], gameServers: GameServer[] = [mockGameServer], players: Player[] = mockPlayers) => ({
  games: {
    ids: games.map(g => g.id),
    entities: keyBy(games, 'id'),
  },
  gameServers: {
    ids: gameServers.map(gs => gs.id),
    entities: keyBy(gameServers, 'id'),
  },
  players: {
    players: {
      ids: players.map(p => p.id),
      entities: keyBy(players, 'id'),
    }
  },
});

describe('GameDetailsComponent', () => {
  let fixture: MockedComponentFixture;
  let component: GameDetailsComponent;
  let store: MockStore<any>;
  let routeParams: Subject<any>;

  beforeEach(() => {
    routeParams = new Subject();
  });

  beforeEach(() => MockBuilder(GameDetailsComponent)
    .provide(provideMockStore({ initialState: makeState([]) }))
    .mock(ActivatedRoute, {
      paramMap: routeParams.pipe(map(convertToParamMap)),
    })
    .mock(GamesService)
    .mock(Title)
    .mock(GameAdminButtonsComponent)
    .mock(GameSummaryComponent)
    .mock(GameBasicInfoComponent)
    .mock(ConnectStringComponent)
    .mock(MumbleJoinButtonComponent)
    .mock(GameTeamHeaderComponent)
    .mock(GameTeamPlayerListComponent)
    .mock(SoundPlayerService)
  );

  beforeEach(() => {
    fixture = MockRender(GameDetailsComponent);
    component = fixture.point.componentInstance;

    store = TestBed.inject(MockStore);
    store.overrideSelector(profile, null);
    store.overrideSelector(isLoggedIn, false);
    store.overrideSelector(isBanned, false);
    store.overrideSelector(activeGame, null);
    store.overrideSelector(isAdmin, false);
    spyOn(store, 'dispatch');

    fixture.detectChanges();

    const soundPlayerService = TestBed.inject(SoundPlayerService) as jasmine.SpyObj<SoundPlayerService>;
    soundPlayerService.playSound.and.returnValue(of(null));
  });

  afterEach(() => {
    routeParams.unsubscribe();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('with game id', () => {
    beforeEach(() => {
      routeParams.next({ id: 'FAKE_GAME_ID' });
    });

    it('should attempt to load the game', () => {
      expect(store.dispatch).toHaveBeenCalledWith(loadGame({ gameId: 'FAKE_GAME_ID' }));
    });

    describe('without game server', () => {
      beforeEach(() => {
        store.setState(makeState([gameInProgress], []));
        fixture.detectChanges();
      });

      it('should attempt to load the game server', () => {
        expect(store.dispatch).toHaveBeenCalledWith(loadGameServer({ gameServerId: 'FAKE_GAME_SERVER_ID' }));
      });
    });

    describe('without players', () => {
      beforeEach(() => {
        // @ts-ignore
        store.dispatch.calls.reset();
        store.setState(makeState([gameInProgress], [mockGameServer], []));
        fixture.detectChanges();
      });

      it('should attempt to load players', () => {
        expect(store.dispatch).toHaveBeenCalledTimes(2);
      });
    });

    describe('and with the game loaded', () => {
      beforeEach(() => {
        store.setState(makeState([gameInProgress]));
        fixture.detectChanges();
      });

      it('should set the title', () => {
        const title = TestBed.inject(Title);
        expect(title.setTitle).toHaveBeenCalledWith(jasmine.stringMatching(/Pickup #3/));
      });

      it('should render game basic info', () => {
        const gameBasicInfo = ngMocks.find(GameBasicInfoComponent).componentInstance;
        expect(gameBasicInfo.map).toEqual('cp_sunshine');
        expect(gameBasicInfo.state).toEqual('launching');
        expect(gameBasicInfo.gameServerName).toEqual('FAKE_GAME_SERVER');
      });

      ['blu', 'red'].forEach(team => it(`should render ${team} header`, () => {
        const gameTeamHeader = ngMocks.find(`.team-${team} app-game-team-header`)?.componentInstance as GameTeamHeaderComponent;
        expect(gameTeamHeader).toBeTruthy();
        expect(gameTeamHeader.team).toEqual(team);
      }));

      ['blu', 'red'].forEach(team => it(`should render ${team} players`, () => {
        const gameTeamPlayerList = ngMocks.find(`.team-${team} app-game-team-player-list`)
          ?.componentInstance as GameTeamPlayerListComponent;
        expect(gameTeamPlayerList).toBeTruthy();
        expect(gameTeamPlayerList.showAdminActionButtons).toBe(false);
        expect(gameTeamPlayerList.locked).toBe(true);
      }));

      describe('when the game is running', () => {
        it('should render the connect string', () => {
          const connectString = ngMocks.find(ConnectStringComponent).componentInstance;
          expect(connectString.stvConnectString).toEqual('FAKE_STV_CONNECT_STRING');
          expect(connectString.connectString).toBeUndefined();
        });

        it('should not render the voice server button', () => {
          expect(() => ngMocks.find(MumbleJoinButtonComponent)).toThrow();
        });

        describe('when logged in', () => {
          beforeEach(() => {
            profile.setResult({ player: { id: 'FAKE_PLAYER_ID' } } as Profile);
            isLoggedIn.setResult(true);
            store.refreshState();
            fixture.detectChanges();
          });

          it('should be able to take the substitute spot', () => {
            const gameTeamPlayerList = ngMocks.find(GameTeamPlayerListComponent).componentInstance;
            expect(gameTeamPlayerList.locked).toBe(false);

            gameTeamPlayerList.replacePlayer.emit('FAKE_PLAYER_1_ID');
            expect(store.dispatch).toHaveBeenCalledWith(replacePlayer({ gameId: 'FAKE_GAME_ID', replaceeId: 'FAKE_PLAYER_1_ID' }));
          });

          describe('and banned', () => {
            beforeEach(() => {
              isBanned.setResult(true);
              store.refreshState();
              fixture.detectChanges();
            });

            it('should not be able to take the substitute spot', () => {
              const gameTeamPlayerList = ngMocks.find(GameTeamPlayerListComponent).componentInstance;
              expect(gameTeamPlayerList.locked).toBe(true);
            });
          });

          describe('and has active game', () => {
            beforeEach(() => {
              activeGame.setResult({ id: 'OTHER_GAME_ID' } as Game);
              store.refreshState();
              fixture.detectChanges();
            });

            it('should not be able to take the substitute spot', () => {
              const gameTeamPlayerList = ngMocks.find(GameTeamPlayerListComponent).componentInstance;
              expect(gameTeamPlayerList.locked).toBe(true);
            });
          });

          describe('and takes part in this game', () => {
            beforeEach(() => {
              profile.setResult({ player: { id: 'FAKE_PLAYER_1_ID', name: 'FAKE PLAYER' } } as Profile);
              activeGame.setResult({ id: 'FAKE_GAME_ID' } as Game);
              store.refreshState();
              fixture.detectChanges();
            });

            it('should have access to the connect string', () => {
              const connectString = ngMocks.find(ConnectStringComponent).componentInstance;
              expect(connectString.connectString).toEqual('FAKE_CONNECT_STRING');
              expect(connectString.stvConnectString).toBeUndefined();
            });

            it('should have the join mumble button', () => {
              const mumbleJoinButton = ngMocks.find(MumbleJoinButtonComponent).componentInstance;
              expect(mumbleJoinButton.mumbleUrl).toEqual('mumble://FAKE_PLAYER@melkor.tf/tf2pickup/5/RED');
            });

            describe('when subbed out', () => {
              beforeEach(() => {
                store.setState(makeState([{
                  ...gameInProgress,
                  slots: [
                    {
                      player: 'FAKE_PLAYER_1_ID',
                      gameClass: 'soldier',
                      team: 'red',
                      connectionStatus: 'offline',
                      status: 'waiting for substitute',
                    },
                    {
                      player: 'FAKE_PLAYER_2_ID',
                      gameClass: 'soldier',
                      team: 'blu',
                      connectionStatus: 'offline',
                      status: 'active',
                    },
                  ],
                }]));
              });

              it('should be able to sub himself', () => {
                const gameTeamPlayerList = ngMocks.find(GameTeamPlayerListComponent).componentInstance;
                expect(gameTeamPlayerList.locked).toBe(false);
              });
            });
          });
        });

        describe('and the connect string becomes available', () => {
          beforeEach(() => {
            store.setState(makeState([{
              ...gameInProgress,
              connectString: undefined,
            }]));
            store.setState(makeState([ gameInProgress ]));
          });

          it('should play the ready-up sound', () => {
            const soundPlayerService = TestBed.inject(SoundPlayerService) as jasmine.SpyObj<SoundPlayerService>;
            expect(soundPlayerService.playSound).toHaveBeenCalledTimes(1);
          });
        });

        describe('when a player is replaced', () => {
          beforeEach(() => {
            store.setState(makeState([{
              ...gameInProgress,
              slots: [
                {
                  player: 'FAKE_PLAYER_1_ID',
                  gameClass: 'soldier',
                  team: 'red',
                  connectionStatus: 'offline',
                  status: 'active',
                },
                {
                  player: 'FAKE_PLAYER_2_ID',
                  gameClass: 'soldier',
                  team: 'blu',
                  connectionStatus: 'offline',
                  status: 'replaced',
                },
              ],
            }]));
            fixture.detectChanges();
          });

          it('should not list this player', () => {
            const players = ngMocks
              .findAll(GameTeamPlayerListComponent)
              .reduce((acc, m) => acc.concat(m.componentInstance.players), []);
            expect(players.length).toEqual(1);
            expect(players[0].id).toEqual('FAKE_PLAYER_1_ID');
          });
        });

        describe('when a player is waiting for substitute', () => {
          beforeEach(() => {
            store.setState(makeState([{
              ...gameInProgress,
              slots: [
                {
                  player: 'FAKE_PLAYER_1_ID',
                  gameClass: 'soldier',
                  team: 'red',
                  connectionStatus: 'offline',
                  status: 'active',
                },
                {
                  player: 'FAKE_PLAYER_2_ID',
                  gameClass: 'soldier',
                  team: 'blu',
                  connectionStatus: 'offline',
                  status: 'waiting for substitute',
                },
              ],
            }]));
            fixture.detectChanges();
          });

          it('should list this player', () => {
            const players = ngMocks
              .findAll(GameTeamPlayerListComponent)
              .reduce((acc, m) => acc.concat(m.componentInstance.players), []);
            expect(players.length).toEqual(2);
          });
        });
      });

      describe('when the game has ended', () => {
        beforeEach(() => {
          store.setState(makeState([endedGame]));
          fixture.detectChanges();
        });

        it('should render game summary', () => {
          const gameSummary = ngMocks.find(GameSummaryComponent).componentInstance;
          expect(gameSummary.demoUrl).toEqual('FAKE_DEMO_URL');
          expect(gameSummary.logsUrl).toEqual('FAKE_LOGS_URL');
        });

        it('should not render any connect strings', () => {
          expect(() => ngMocks.find(ConnectStringComponent)).toThrow();
        });

        it('should not render player connection statuses', () => {
          const playerList = ngMocks.find(GameTeamPlayerListComponent).componentInstance;
          expect(playerList.showPlayerConnectionStatus).toBe(false);
        });

        it('should render score', () => {
          const gameTeamHeaders = ngMocks.findAll(GameTeamHeaderComponent).map(m => m.componentInstance);

          const bluHeader = gameTeamHeaders.find(h => h.team === 'blu');
          expect(bluHeader.score).toEqual(1);

          const redHeader = gameTeamHeaders.find(h => h.team === 'red');
          expect(redHeader.score).toEqual(2);
        });
      });
    });

    describe('when the current user is admin', () => {
      let gameAdminButtons: GameAdminButtonsComponent;
      let gameTeamPlayerLists: GameTeamPlayerListComponent[];

      beforeEach(() => {
        isAdmin.setResult(true);
        store.setState(makeState([gameInProgress]));
        store.refreshState();
        fixture.detectChanges();

        gameAdminButtons = ngMocks.find(GameAdminButtonsComponent).componentInstance;
        gameTeamPlayerLists = ngMocks.findAll(GameTeamPlayerListComponent).map(m => m.componentInstance);
      });

      it('should render admin buttons', () => {
        expect(gameAdminButtons).toBeTruthy();
        expect(gameTeamPlayerLists.every(playerList => playerList.showAdminActionButtons)).toBe(true);
      });

      it('should be able to reinitialize the game server', () => {
        gameAdminButtons.reinitializeServer.emit();
        expect(store.dispatch).toHaveBeenCalledWith(reinitializeServer({ gameId: 'FAKE_GAME_ID' }));
      });

      it('should be able to force-end the game', () => {
        gameAdminButtons.forceEnd.emit();
        expect(store.dispatch).toHaveBeenCalledWith(forceEndGame({ gameId: 'FAKE_GAME_ID' }));
      });

      it('should be able to request substitute', () => {
        const gameTeamPlayerList = ngMocks.find(GameTeamPlayerListComponent).componentInstance;
        gameTeamPlayerList.requestSubstitute.emit('FAKE_PLAYER_1_ID');
        expect(store.dispatch).toHaveBeenCalledWith(requestSubstitute({ gameId: 'FAKE_GAME_ID', playerId: 'FAKE_PLAYER_1_ID' }));
      });

      it('should attempt to load assigned skills', () => {
        const gamesService = TestBed.inject(GamesService);
        expect(gamesService.fetchGameSkills).toHaveBeenCalledWith('FAKE_GAME_ID');
      });
    });
  });
});
