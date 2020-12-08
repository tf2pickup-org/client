import { ReplaySubject, Subject, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { TestBed } from '@angular/core/testing';
import { GamesEffects } from './games.effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { GamesService } from './games.service';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { requestSubstitute, cancelSubstitutionRequest, replacePlayer, gameUpdated, loadGame, gameCreated,
  ownGameAdded } from './games.actions';
import { routerNavigatedAction } from '@ngrx/router-store';
import { NavigationEnd } from '@angular/router';
import { Socket } from '@app/io/socket';
import { EventEmitter } from 'eventemitter3';
import { Game } from './models/game';

const fakeGame: Game = {
  state: 'launching',
  // eslint-disable-next-line id-blacklist
  number: 453,
  map: 'cp_sunshine',
  slots: [
    {
      status: 'waiting for substitute',
      connectionStatus: 'offline',
      player: 'PLAYER_ID_1',
      gameClass: 'soldier',
      team: 'red',
    },
    {
      status: 'active',
      connectionStatus: 'offline',
      player: 'PLAYER_ID_2',
      gameClass: 'soldier',
      team: 'blu',
    }
  ],
  launchedAt: new Date('2020-01-02T21:54:23.036Z'),
  gameServer: '5e0145b90ea72823a3059ced',
  mumbleUrl: 'mumble://melkor.tf/tf2pickup/1',
  connectString: 'connect 192.168.1.11:27015; password 0I9vNJTDpC',
  id: 'FAKE_GAME_ID'
};

class GamesServiceStub {
  requestSubstitute(gameId: string, playerId: string) { return of(null); }
  cancelSubstitutionRequest(gameId: string, playerId: string) { return of(null); }
  replacePlayer(gameId: string, replaceeId: string, replacementId: string) { return of(fakeGame); }
}

const initialState = {
  games: {
    ids: [
      'FAKE_GAME_ID'
    ],
    entities: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      FAKE_GAME_ID: fakeGame,
    },
  },
  profile: {
    hasAcceptedRules: true,
    steamId: '76561198074409147',
    name: 'mały',
    avatarUrl: 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/96/962ac5adb6b0cce647227a2c429c035e56197fb2.jpg',
    role: 'super-user',
    etf2lProfileId: 112758,
    joinedAt: '2019-08-02T19:01:09.576Z',
    id: '5d448875b963ff7e00c6b6b3',
    activeGameId: null,
    bans: [],
  }
};

describe('GamesEffects', () => {
  let actions: ReplaySubject<Action>;
  let effects: GamesEffects;
  let gamesService: GamesService;

  beforeEach(() => actions = new ReplaySubject<Action>(1));

  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      RouterTestingModule,
    ],
    providers: [
      GamesEffects,
      provideMockActions(() => actions.asObservable()),
      { provide: GamesService, useClass: GamesServiceStub },
      provideMockStore({ initialState }),
      { provide: Socket, useClass: EventEmitter },
    ],
  }));

  beforeEach(() => {
    effects = TestBed.inject(GamesEffects);
    gamesService = TestBed.inject(GamesService);
  });

  afterEach(() => actions.complete());

  it('should handle game events', () => {
    const socket = TestBed.inject(Socket);
    const spy = spyOn(TestBed.inject(MockStore), 'dispatch');

    const game = { id: 'FAKE_GAME_ID' };

    // @ts-ignore
    socket.emit('game created', game);
    expect(spy).toHaveBeenCalledWith(gameCreated({ game } as any));

    // @ts-ignore
    socket.emit('game updated', game);
    expect(spy).toHaveBeenCalledWith(gameUpdated({ game } as any));
  });

  describe('loadRoutedGame', () => {
    it('should load the given game', () => {
      effects.loadRoutedGame.subscribe(action => expect(action).toEqual(loadGame({ gameId: 'FAKE_GAME_ID' })));
      actions.next(routerNavigatedAction({
        payload: {
          routerState: {
            url: '/game/FAKE_GAME_ID',
            root: {
              children: [
                {
                  params: {
                    id: 'FAKE_GAME_ID',
                  },
                } as any,
              ],
            } as any,
          },
          event: { } as NavigationEnd,
        },
      }));
    });
  });

  describe('ownGameStarted', () => {
    describe('when the current user is part of the game', () => {
      const game: Game = {
        id: 'FAKE_GAME_ID',
        launchedAt: new Date(),
        // eslint-disable-next-line id-blacklist
        number: 1,
        slots: [
          {
            player: 'FAKE_PLAYER_ID',
            gameClass: 'soldier',
            team: 'red',
            connectionStatus: 'connected',
            status: 'active',
          },
        ],
        map: 'cp_badlands',
        state: 'launching',
      };

      it('should dispatch the ownGameAdded action', done => {
        effects.ownGameStarted.subscribe(action => {
          expect(action).toEqual(ownGameAdded({ gameId: 'FAKE_GAME_ID' }));
          done();
        });
        actions.next(gameCreated({ game }));
      });
    });
  });

  describe('requestSubstitute', () => {
    it('should call service', () => {
      effects.requestSubstitute.subscribe();
      const spy = spyOn(gamesService, 'requestSubstitute').and.callThrough();
      actions.next(requestSubstitute({ gameId: 'FAKE_GAME_ID', playerId: 'FAKE_PLAYER_ID' }));
      expect(spy).toHaveBeenCalledWith('FAKE_GAME_ID', 'FAKE_PLAYER_ID');
    });
  });

  describe('cancelSubstitutionRequest', () => {
    it('should call service', () => {
      effects.cancelSubstitutionRequest.subscribe();
      const spy = spyOn(gamesService, 'cancelSubstitutionRequest').and.callThrough();
      actions.next(cancelSubstitutionRequest({ gameId: 'FAKE_GAME_ID', playerId: 'FAKE_PLAYER_ID' }));
      expect(spy).toHaveBeenCalledWith('FAKE_GAME_ID', 'FAKE_PLAYER_ID');
    });
  });

  describe('replacePlayer', () => {
    it('should replace the player', () => {
      effects.replacePlayer.subscribe(game => expect(game).toEqual(gameUpdated({ game: fakeGame as any })));
      const spy = spyOn(gamesService, 'replacePlayer').and.callThrough();
      actions.next(replacePlayer({ gameId: 'FAKE_GAME_ID', replaceeId: 'FAKE_REPLACEE_PLAYER_ID' }));
      expect(spy).toHaveBeenCalled();
    });
  });
});
