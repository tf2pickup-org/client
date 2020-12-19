import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { GameDetailsComponent } from './game-details.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { SharedModule } from '@app/shared/shared.module';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of, NEVER } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { forceEndGame, reinitializeServer, replacePlayer, requestSubstitute } from '../games.actions';
import { ChangeDetectionStrategy } from '@angular/core';
import { GamesService } from '../games.service';
import { MockComponent } from 'ng-mocks';
import { GameBasicInfoComponent } from '../game-basic-info/game-basic-info.component';
import { By } from '@angular/platform-browser';
import { GameSummaryComponent } from '../game-summary/game-summary.component';
import { merge } from 'lodash';
import { GameTeamHeaderComponent } from '../game-team-header/game-team-header.component';
import { GameTeamPlayerListComponent } from '../game-team-player-list/game-team-player-list.component';
import { ConnectStringComponent } from '../connect-string/connect-string.component';
import { GameAdminButtonsComponent } from '../game-admin-buttons/game-admin-buttons.component';
import { MumbleJoinButtonComponent } from '../mumble-join-button/mumble-join-button.component';
import { Howl } from 'howler';

const paramMap = of(convertToParamMap({ id: 'FAKE_ID' }));

const makeStateWithGame = (overrides?: any) => merge({
  games: {
    ids: ['FAKE_ID'],
    entities: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      FAKE_ID: {
        id: 'FAKE_ID',
        slots: [
          {
            player: 'FAKE_PLAYER_ID_1',
            gameClass: 'soldier',
            team: 'red',
            connectionStatus: 'offline',
            status: 'active',
          },
          {
            player: 'FAKE_PLAYER_ID_2',
            gameClass: 'soldier',
            team: 'blu',
            connectionStatus: 'offline',
            status: 'active',
          }
        ],
        map: 'cp_sunshine',
        state: 'launching',
        launchedAt: new Date('2019-07-25T11:42:55.121Z'),
        // eslint-disable-next-line id-blacklist
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
    role: null,
  },
  players: {
    players: {
      ids: [
        'FAKE_PLAYER_ID_1',
        'FAKE_PLAYER_ID_2',
      ],
      entities: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        FAKE_PLAYER_ID_1: {
          id: 'FAKE_PLAYER_ID_1',
          name: 'FAKE_PLAYER_1',
          gameClass: 'soldier',
          status: 'active',
        },
        // eslint-disable-next-line @typescript-eslint/naming-convention
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
      // eslint-disable-next-line @typescript-eslint/naming-convention
      FAKE_GAME_SERVER_ID: { id: 'FAKE_GAME_SERVER_ID', name: 'FAKE_GAME_SERVER_NAME' },
    },
  },
}, overrides);

class GamesServiceStub {
  fetchGameSkills(gameId: string) { }
}

describe('GameDetailsComponent', () => {
  let component: GameDetailsComponent;
  let fixture: ComponentFixture<GameDetailsComponent>;
  let store: MockStore<any>;
  let storeDispatchSpy: jasmine.Spy;

  const initialState = { games: { ids: [], entities: { }, loaded: false } };

  beforeEach(() => {
    // @ts-ignore
    spyOn(Howl.prototype, 'init');
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        GameDetailsComponent,
        MockComponent(GameBasicInfoComponent),
        MockComponent(GameSummaryComponent),
        MockComponent(GameTeamHeaderComponent),
        MockComponent(GameTeamPlayerListComponent),
        MockComponent(ConnectStringComponent),
        MockComponent(GameAdminButtonsComponent),
        MockComponent(MumbleJoinButtonComponent),
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
      ],
    })
    // https://github.com/angular/angular/issues/12313
    .overrideComponent(GameDetailsComponent, { set: { changeDetection: ChangeDetectionStrategy.Default } })
    .compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.inject(MockStore);
    storeDispatchSpy = spyOn(store, 'dispatch');

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

    it('should render the pickup header', () => {
      const header = fixture.debugElement.query(By.css('.mdc-typography--headline4')).nativeElement as HTMLElement;
      expect(header.innerText).toMatch(/Pickup #3/);
    });

    describe('when logged in as an admin', () => {
      let fetchGameSkillsSpy: jasmine.Spy;
      let gameAdminButtons: GameAdminButtonsComponent;

      beforeEach(() => {
        fetchGameSkillsSpy = spyOn(TestBed.inject(GamesService), 'fetchGameSkills').and.returnValue(NEVER);
        store.setState(makeStateWithGame({ profile: { role: 'admin' } }));
        fixture.detectChanges();

        gameAdminButtons = fixture.debugElement.query(By.css('app-game-admin-buttons')).componentInstance;
      });

      it('should render admin buttons', () => {
        expect(gameAdminButtons).toBeTruthy();
      });

      it('should be able to reinitialize the server', () => {
        gameAdminButtons.reinitializeServer.emit();
        expect(storeDispatchSpy).toHaveBeenCalledWith(reinitializeServer({ gameId: 'FAKE_ID' }));
      });

      it('should be able to force end the game', () => {
        gameAdminButtons.forceEnd.emit();
        expect(storeDispatchSpy).toHaveBeenCalledWith(forceEndGame({ gameId: 'FAKE_ID' }));
      });

      it('should fetch skill of each player if the current user is an admin', () => {
        expect(fetchGameSkillsSpy).toHaveBeenCalledWith('FAKE_ID');
      });
    });

    it('should retrieve players of each team', () => {
      const teamBlu = fixture.debugElement.query(By.css('.team-blu app-game-team-player-list'))
        .componentInstance as GameTeamPlayerListComponent;

      expect(teamBlu.players[0]).toEqual(
        {
          id: 'FAKE_PLAYER_ID_2',
          player: 'FAKE_PLAYER_ID_2',
          name: 'FAKE_PLAYER_2',
          gameClass: 'soldier',
          team: 'blu',
          connectionStatus: 'offline',
          status: 'active',
        } as any
      );

      const playersRed = fixture.debugElement.query(By.css('.team-red app-game-team-player-list'))
        .componentInstance as GameTeamPlayerListComponent;

      expect(playersRed.players).toEqual([
        {
          id: 'FAKE_PLAYER_ID_1',
          player: 'FAKE_PLAYER_ID_1',
          name: 'FAKE_PLAYER_1',
          gameClass: 'soldier',
          team: 'red',
          connectionStatus: 'offline',
          status: 'active',
        } as any
      ]);
    });

    describe('app-game-team-player-list', () => {
      let gameTeamPlayerList: GameTeamPlayerListComponent;

      beforeEach(() => {
        gameTeamPlayerList = fixture.debugElement.query(By.css('app-game-team-player-list')).componentInstance;
      });

      it('should request substitute', () => {
        gameTeamPlayerList.requestSubstitute.emit('FAKE_PLAYER_ID');
        expect(storeDispatchSpy).toHaveBeenCalledWith(requestSubstitute({ gameId: 'FAKE_ID', playerId: 'FAKE_PLAYER_ID' }));
      });

      it('should replace player', () => {
        gameTeamPlayerList.replacePlayer.emit('FAKE_REPLACEE_ID');
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
          store.setState(makeStateWithGame({
            games: {
              entities: {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                FAKE_ID: {
                  connectString: 'connect 192.168.1.101:27015; password FAKE_PASSWORD'
                },
              },
            },
          }));
          fixture.detectChanges();
        });

        it('should render the ConnectStringComponent', () => {
          const connectString = fixture.debugElement.query(By.css('app-connect-string')).componentInstance as ConnectStringComponent;
          expect(connectString.connectString).toEqual('connect 192.168.1.101:27015; password FAKE_PASSWORD');
        });
      });

      describe('when the mumble url is available', () => {
        beforeEach(() => {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          store.setState(makeStateWithGame({ games: { entities: { FAKE_ID: { mumbleUrl: 'mumble://melkor.tf/tf2pickup/5' } } } }));
          fixture.detectChanges();
        });

        it('should pass the mumble url to the MumbleJoinButtonComponent', () => {
          const mumbleJoinButton = fixture.debugElement.query(By.css('app-mumble-join-button'))
            .componentInstance as MumbleJoinButtonComponent;
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
                // eslint-disable-next-line @typescript-eslint/naming-convention
                FAKE_ID: { stvConnectString: 'connect 192.168.1.101:27020; password tv' },
              },
            },
          }));
          fixture.detectChanges();
        });

        it('should render ConnectString with the stv connect', () => {
          const connectString = fixture.debugElement.query(By.css('app-connect-string')).componentInstance as ConnectStringComponent;
          expect(connectString.stvConnectString).toEqual('connect 192.168.1.101:27020; password tv');
        });
      });
    });

    describe('that has already ended', () => {
      beforeEach(() => {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        store.setState(makeStateWithGame({ games: { entities: { FAKE_ID: { state: 'ended' } } } }));
        fixture.detectChanges();
      });

      it('should not render the connect string anymore', () => {
        expect(fixture.debugElement.query(By.css('app-connect-string'))).toBeFalsy();
      });

      it('should render game summary', () => {
        const gameSummary = fixture.debugElement.query(By.css('app-game-summary')).componentInstance as GameSummaryComponent;
        expect(gameSummary).toBeTruthy();
      });
    });

    it('should play a sound when the connect is available', () => {
      store.setState(makeStateWithGame({
        games: {
          entities: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            FAKE_ID: {
              connectString: 'connect 192.168.1.101:27015; password FAKE_PASSWORD',
            },
          },
        },
      }));
      fixture.detectChanges();
      // @ts-ignore
      expect(Howl.prototype.init).toHaveBeenCalledOnceWith({
        src: jasmine.any(Array),
        autoplay: true,
      });
    });

    describe('when the score is defined', () => {
      beforeEach(() => {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        store.setState(makeStateWithGame({ games: { entities: { FAKE_ID: { score: { blu: 5, red: 3 } } } } }));
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
