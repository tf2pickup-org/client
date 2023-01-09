import { TestBed } from '@angular/core/testing';
import { GameDetailsComponent } from './game-details.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of, Subject } from 'rxjs';
import {
  MockBuilder,
  MockedComponentFixture,
  MockRender,
  ngMocks,
} from 'ng-mocks';
import { GameBasicInfoComponent } from '../game-basic-info/game-basic-info.component';
import { Title } from '@angular/platform-browser';
import { GameSummaryComponent } from '../game-summary/game-summary.component';
import { GameTeamHeaderComponent } from '../game-team-header/game-team-header.component';
import { GameTeamPlayerListComponent } from '../game-team-player-list/game-team-player-list.component';
import { Game } from '../models/game';
import { map } from 'rxjs/operators';
import {
  activeGameId,
  currentPlayer,
  isAdmin,
  isBanned,
  isLoggedIn,
  profile,
} from '@app/profile/profile.selectors';
import { GameServer } from '@app/game-servers/models/game-server';
import { ConnectStringComponent } from '../connect-string/connect-string.component';
import { GameAdminButtonsComponent } from '../game-admin-buttons/game-admin-buttons.component';
import { JoinVoiceButtonComponent } from '../join-voice-button/join-voice-button.component';
import {
  forceEndGame,
  loadGame,
  reinitializeServer,
  replacePlayer,
  requestSubstitute,
} from '../games.actions';
import { keyBy } from 'lodash-es';
import { Player } from '@app/players/models/player';
import { GamesService } from '../games.service';
import { SoundPlayerService } from '@app/shared/sound-player.service';
import { ConnectInfo } from '../models/connect-info';
import { PlayersInTeamPipe } from './players-in-team.pipe';
import { ShowSkillsSwitchComponent } from '../show-skills-switch/show-skills-switch.component';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { InjectionToken } from '@angular/core';

const mockPlayer1 = {
  id: 'FAKE_PLAYER_1_ID',
  name: 'FAKE_PLAYER_1',
  joinedAt: new Date('2019-08-01T13:42:55.121Z'),
  steamId: 'FAKE_PLAYER_1_STEAM_ID',
  roles: [],
  avatar: {
    small: 'FAKE_PLAYER_1_SMALL_AVATAR_URL',
    medium: 'FAKE_PLAYER_1_MEDIUM_AVATAR_URL',
    large: 'FAKE_PLAYER_1_LARGE_AVATAR_URL',
  },
  _links: [],
};

const mockPlayer2 = {
  id: 'FAKE_PLAYER_2_ID',
  name: 'FAKE_PLAYER_2',
  joinedAt: new Date('2019-08-01T13:42:55.121Z'),
  steamId: 'FAKE_PLAYER_2_STEAM_ID',
  roles: [],
  avatar: {
    small: 'FAKE_PLAYER_2_SMALL_AVATAR_URL',
    medium: 'FAKE_PLAYER_2_MEDIUM_AVATAR_URL',
    large: 'FAKE_PLAYER_2_LARGE_AVATAR_URL',
  },
  _links: [],
};

const gameInProgress: Game = {
  id: 'FAKE_GAME_ID',
  map: 'cp_sunshine',
  state: 'launching',
  launchedAt: new Date('2019-07-25T11:42:55.121Z'),
  number: 3,
  gameServer: {
    id: 'FAKE_GAME_SERVER_ID',
    name: 'FAKE_GAME_SERVER',
  } as GameServer,
  stvConnectString: 'FAKE_STV_CONNECT_STRING',
  mumbleUrl: 'mumble://melkor.tf/tf2pickup/5',
  slots: [
    {
      player: mockPlayer1,
      gameClass: 'soldier',
      team: 'red',
      connectionStatus: 'offline',
      status: 'active',
    },
    {
      player: mockPlayer2,
      gameClass: 'soldier',
      team: 'blu',
      connectionStatus: 'offline',
      status: 'active',
    },
  ],
  connectInfoVersion: 0,
};

const endedGame: Game = {
  id: 'FAKE_GAME_ID',
  map: 'cp_sunshine',
  state: 'ended',
  launchedAt: new Date('2019-07-25T11:42:55.121Z'),
  number: 3,
  gameServer: {
    id: 'FAKE_GAME_SERVER_ID',
    name: 'FAKE_GAME_SERVER',
  } as GameServer,
  slots: [
    {
      player: mockPlayer1,
      gameClass: 'soldier',
      team: 'red',
      connectionStatus: 'offline',
      status: 'active',
    },
    {
      player: mockPlayer2,
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
  connectInfoVersion: 1,
};

const makeState = (games: Game[]) => ({
  games: {
    ids: games.map(g => g.id),
    entities: keyBy(games, 'id'),
  },
  profile: {
    authenticated: 'unknown',
  },
});

describe('GameDetailsComponent', () => {
  let fixture: MockedComponentFixture;
  let component: GameDetailsComponent;
  let store: MockStore<any>;
  let routeParams: Subject<any>;
  let connectInfo: Subject<ConnectInfo>;

  beforeEach(() => {
    routeParams = new Subject();
    connectInfo = new Subject();
  });

  beforeEach(() =>
    MockBuilder(GameDetailsComponent)
      .provide(provideMockStore({ initialState: makeState([]) }))
      .mock(ActivatedRoute, {
        paramMap: routeParams.pipe(map(convertToParamMap)),
      })
      .mock(GamesService, {
        fetchConnectInfo: jasmine
          .createSpy('fetchConnectInfo')
          .and.returnValue(connectInfo.asObservable()),
      })
      .mock(LOCAL_STORAGE, {
        set: jasmine.createSpy('StorageService.set'),
        get: jasmine.createSpy('StorageService.get').and.returnValue(false),
      } as unknown as InjectionToken<StorageService<any>>)
      .mock(Title)
      .mock(GameAdminButtonsComponent)
      .mock(GameSummaryComponent)
      .mock(GameBasicInfoComponent)
      .mock(ConnectStringComponent)
      .mock(JoinVoiceButtonComponent)
      .mock(GameTeamHeaderComponent)
      .mock(GameTeamPlayerListComponent)
      .mock(SoundPlayerService)
      .mock(ShowSkillsSwitchComponent)
      .keep(PlayersInTeamPipe),
  );

  beforeEach(() => {
    fixture = MockRender(GameDetailsComponent);
    component = fixture.point.componentInstance;

    store = TestBed.inject(MockStore);
    store.overrideSelector(profile, { authenticated: 'not authenticated' });
    store.overrideSelector(isLoggedIn, false);
    store.overrideSelector(isBanned, false);
    store.overrideSelector(activeGameId, null);
    store.overrideSelector(isAdmin, false);
    store.overrideSelector(currentPlayer, null);
    spyOn(store, 'dispatch');

    fixture.detectChanges();

    const soundPlayerService = TestBed.inject(
      SoundPlayerService,
    ) as jasmine.SpyObj<SoundPlayerService>;
    soundPlayerService.playSound.and.returnValue(of(null));
  });

  afterEach(() => {
    routeParams.unsubscribe();
    TestBed.inject(MockStore)?.resetSelectors();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('with game id', () => {
    beforeEach(() => {
      routeParams.next({ id: 'FAKE_GAME_ID' });
    });

    it('should attempt to load the game', () => {
      expect(store.dispatch).toHaveBeenCalledWith(
        loadGame({ gameId: 'FAKE_GAME_ID' }),
      );
    });

    describe('and with the game loaded', () => {
      beforeEach(() => {
        store.setState(makeState([gameInProgress]));
        fixture.detectChanges();
      });

      it('should set the title', () => {
        const title = TestBed.inject(Title);
        expect(title.setTitle).toHaveBeenCalledWith(
          jasmine.stringMatching(/Pickup #3/),
        );
      });

      it('should render game basic info', () => {
        const gameBasicInfo = ngMocks.find(
          GameBasicInfoComponent,
        ).componentInstance;
        expect(gameBasicInfo.map).toEqual('cp_sunshine');
        expect(gameBasicInfo.state).toEqual('launching');
        expect(gameBasicInfo.gameServerName).toEqual('FAKE_GAME_SERVER');
      });

      ['blu', 'red'].forEach(team =>
        it(`should render ${team} header`, () => {
          const gameTeamHeader = ngMocks.find(
            `.team-${team} app-game-team-header`,
          )?.componentInstance as GameTeamHeaderComponent;
          expect(gameTeamHeader).toBeTruthy();
          expect(gameTeamHeader.team).toEqual(team);
        }),
      );

      ['blu', 'red'].forEach(team =>
        it(`should render ${team} players`, () => {
          const gameTeamPlayerList = ngMocks.find(
            `.team-${team} app-game-team-player-list`,
          )?.componentInstance as GameTeamPlayerListComponent;
          expect(gameTeamPlayerList).toBeTruthy();
          expect(
            gameTeamPlayerList.slots.every(slot => slot.team === team),
          ).toBe(true);
          expect(gameTeamPlayerList.showAdminActionButtons).toBe(false);
          expect(gameTeamPlayerList.locked).toBe(true);
        }),
      );

      describe('when the game is running', () => {
        it('should render the connect string', () => {
          const connectString = ngMocks.find(
            ConnectStringComponent,
          ).componentInstance;
          expect(connectString.stvConnectString).toEqual(
            'FAKE_STV_CONNECT_STRING',
          );
          expect(connectString.connectString).toBeUndefined();
        });

        it('should not render the voice server button', () => {
          expect(() => ngMocks.find(JoinVoiceButtonComponent)).toThrow();
        });

        describe('when logged in', () => {
          beforeEach(() => {
            profile.setResult({
              authenticated: 'authenticated',
              player: { id: 'FAKE_PLAYER_ID' },
            } as any);
            isLoggedIn.setResult(true);
            store.refreshState();
            fixture.detectChanges();
          });

          it('should be able to take the substitute spot', () => {
            const gameTeamPlayerList = ngMocks.find(
              GameTeamPlayerListComponent,
            ).componentInstance;
            expect(gameTeamPlayerList.locked).toBe(false);

            gameTeamPlayerList.replacePlayer.emit('FAKE_PLAYER_1_ID');
            expect(store.dispatch).toHaveBeenCalledWith(
              replacePlayer({
                gameId: 'FAKE_GAME_ID',
                replaceeId: 'FAKE_PLAYER_1_ID',
              }),
            );
          });

          describe('and banned', () => {
            beforeEach(() => {
              isBanned.setResult(true);
              store.refreshState();
              fixture.detectChanges();
            });

            it('should not be able to take the substitute spot', () => {
              const gameTeamPlayerList = ngMocks.find(
                GameTeamPlayerListComponent,
              ).componentInstance;
              expect(gameTeamPlayerList.locked).toBe(true);
            });
          });

          describe('and has active game', () => {
            beforeEach(() => {
              activeGameId.setResult('OTHER_GAME_ID');
              store.refreshState();
              fixture.detectChanges();
            });

            it('should not be able to take the substitute spot', () => {
              const gameTeamPlayerList = ngMocks.find(
                GameTeamPlayerListComponent,
              ).componentInstance;
              expect(gameTeamPlayerList.locked).toBe(true);
            });
          });

          describe('and takes part in this game', () => {
            beforeEach(() => {
              currentPlayer.setResult({
                id: 'FAKE_PLAYER_1_ID',
                name: 'FAKE PLAYER',
              } as Player);
              activeGameId.setResult('FAKE_GAME_ID');
              store.refreshState();
              fixture.detectChanges();
            });

            describe('when new connect info is announced', () => {
              beforeEach(() => {
                store.setState(
                  makeState([
                    {
                      ...gameInProgress,
                      connectInfoVersion: 1,
                    },
                  ]),
                );
                store.refreshState();
                fixture.detectChanges();
              });

              it('should query for the connect info', () => {
                const gamesService = TestBed.inject(
                  GamesService,
                ) as jasmine.SpyObj<GamesService>;
                expect(gamesService.fetchConnectInfo).toHaveBeenCalledWith(
                  'FAKE_GAME_ID',
                );
              });

              describe('when the new connect info is returned', () => {
                beforeEach(() => {
                  connectInfo.next({
                    connectInfoVersion: 1,
                    gameId: 'FAKE_GAME_ID',
                    connectString: 'FAKE_CONNECT_STRING',
                    voiceChannelUrl: 'FAKE_VOICE_CHANNEL_URL',
                  });
                  fixture.detectChanges();
                });

                it('should have access to the connect string', () => {
                  const connectString = ngMocks.find(
                    ConnectStringComponent,
                  ).componentInstance;
                  expect(connectString.connectString).toEqual(
                    'FAKE_CONNECT_STRING',
                  );
                  expect(connectString.stvConnectString).toBeUndefined();
                });

                it('should have access to the voice channel url', () => {
                  const voiceChannelJoinButton = ngMocks.find(
                    JoinVoiceButtonComponent,
                  ).componentInstance;
                  expect(voiceChannelJoinButton.mumbleUrl).toEqual(
                    'FAKE_VOICE_CHANNEL_URL',
                  );
                });
              });
            });

            describe('when subbed out', () => {
              beforeEach(() => {
                store.setState(
                  makeState([
                    {
                      ...gameInProgress,
                      slots: [
                        {
                          player: mockPlayer1,
                          gameClass: 'soldier',
                          team: 'red',
                          connectionStatus: 'offline',
                          status: 'waiting for substitute',
                        },
                        {
                          player: mockPlayer2,
                          gameClass: 'soldier',
                          team: 'blu',
                          connectionStatus: 'offline',
                          status: 'active',
                        },
                      ],
                    },
                  ]),
                );
              });

              it('should be able to sub himself', () => {
                const gameTeamPlayerList = ngMocks.find(
                  GameTeamPlayerListComponent,
                ).componentInstance;
                expect(gameTeamPlayerList.locked).toBe(false);
              });
            });
          });
        });

        describe('when a player is replaced', () => {
          beforeEach(() => {
            store.setState(
              makeState([
                {
                  ...gameInProgress,
                  slots: [
                    {
                      player: mockPlayer1,
                      gameClass: 'soldier',
                      team: 'red',
                      connectionStatus: 'offline',
                      status: 'active',
                    },
                    {
                      player: mockPlayer2,
                      gameClass: 'soldier',
                      team: 'blu',
                      connectionStatus: 'offline',
                      status: 'replaced',
                    },
                  ],
                },
              ]),
            );
            fixture.detectChanges();
          });

          it('should not list this player', () => {
            const players = ngMocks
              .findAll(GameTeamPlayerListComponent)
              .reduce((acc, m) => acc.concat(m.componentInstance.slots), []);
            expect(players.length).toEqual(1);
            expect(players[0].player).toEqual(mockPlayer1);
          });
        });

        describe('when a player is waiting for substitute', () => {
          beforeEach(() => {
            store.setState(
              makeState([
                {
                  ...gameInProgress,
                  slots: [
                    {
                      player: mockPlayer1,
                      gameClass: 'soldier',
                      team: 'red',
                      connectionStatus: 'offline',
                      status: 'active',
                    },
                    {
                      player: mockPlayer2,
                      gameClass: 'soldier',
                      team: 'blu',
                      connectionStatus: 'offline',
                      status: 'waiting for substitute',
                    },
                  ],
                },
              ]),
            );
            fixture.detectChanges();
          });

          it('should list this player', () => {
            const players = ngMocks
              .findAll(GameTeamPlayerListComponent)
              .reduce((acc, m) => acc.concat(m.componentInstance.slots), []);
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
          const gameSummary =
            ngMocks.find(GameSummaryComponent).componentInstance;
          expect(gameSummary.demoUrl).toEqual('FAKE_DEMO_URL');
          expect(gameSummary.logsUrl).toEqual('FAKE_LOGS_URL');
        });

        it('should not render any connect strings', () => {
          expect(() => ngMocks.find(ConnectStringComponent)).toThrow();
        });

        it('should not attempt to fetch the connect string', () => {
          const gamesService = TestBed.inject(
            GamesService,
          ) as jasmine.SpyObj<GamesService>;
          expect(gamesService.fetchConnectInfo).not.toHaveBeenCalled();
        });

        it('should not render player connection statuses', () => {
          const playerList = ngMocks.find(
            GameTeamPlayerListComponent,
          ).componentInstance;
          expect(playerList.showPlayerConnectionStatus).toBe(false);
        });

        it('should render score', () => {
          const gameTeamHeaders = ngMocks
            .findAll(GameTeamHeaderComponent)
            .map(m => m.componentInstance);

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
      let showSkillsSwitch: ShowSkillsSwitchComponent;

      beforeEach(() => {
        isAdmin.setResult(true);
        store.setState(makeState([gameInProgress]));
        store.refreshState();
        fixture.detectChanges();

        gameAdminButtons = ngMocks.find(
          GameAdminButtonsComponent,
        ).componentInstance;
        gameTeamPlayerLists = ngMocks
          .findAll(GameTeamPlayerListComponent)
          .map(m => m.componentInstance);
        showSkillsSwitch = ngMocks.find(
          ShowSkillsSwitchComponent,
        ).componentInstance;
      });

      it('should render admin buttons', () => {
        expect(gameAdminButtons).toBeTruthy();
        expect(
          gameTeamPlayerLists.every(
            playerList => playerList.showAdminActionButtons,
          ),
        ).toBe(true);
      });

      it('should be able to reinitialize the game server', () => {
        gameAdminButtons.reinitializeServer.emit();
        expect(store.dispatch).toHaveBeenCalledWith(
          reinitializeServer({ gameId: 'FAKE_GAME_ID' }),
        );
      });

      it('should be able to force-end the game', () => {
        gameAdminButtons.forceEnd.emit();
        expect(store.dispatch).toHaveBeenCalledWith(
          forceEndGame({ gameId: 'FAKE_GAME_ID' }),
        );
      });

      it('should be able to request substitute', () => {
        const gameTeamPlayerList = ngMocks.find(
          GameTeamPlayerListComponent,
        ).componentInstance;
        gameTeamPlayerList.requestSubstitute.emit('FAKE_PLAYER_1_ID');
        expect(store.dispatch).toHaveBeenCalledWith(
          requestSubstitute({
            gameId: 'FAKE_GAME_ID',
            playerId: 'FAKE_PLAYER_1_ID',
          }),
        );
      });

      it('should attempt to load assigned skills', () => {
        const gamesService = TestBed.inject(GamesService);
        expect(gamesService.fetchGameSkills).toHaveBeenCalledWith(
          'FAKE_GAME_ID',
        );
      });

      it('should render ShowSkillsSwitch', () => {
        expect(showSkillsSwitch).toBeTruthy();
        expect(
          gameTeamPlayerLists.every(
            playerList => playerList.showAssignedSkills,
          ),
        ).toBe(false);
      });

      describe('and when the ShowSkillsSwitch is toggled', () => {
        beforeEach(() => {
          showSkillsSwitch.showSkillsToggle.emit(true);
          fixture.detectChanges();
        });

        it('should toggle', () => {
          expect(
            gameTeamPlayerLists.every(
              playerList => playerList.showAssignedSkills,
            ),
          ).toBe(true);
          const storage = TestBed.inject(LOCAL_STORAGE);
          // skicq: JS-0296
          expect(storage.set as Function).toHaveBeenCalledWith(
            'skills_visible',
            true,
          );
        });
      });
    });
  });
});
