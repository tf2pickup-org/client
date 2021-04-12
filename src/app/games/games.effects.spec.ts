/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable id-blacklist */
import { ReplaySubject, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { TestBed } from '@angular/core/testing';
import { GamesEffects } from './games.effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { GamesService } from './games.service';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import {
  requestSubstitute,
  cancelSubstitutionRequest,
  replacePlayer,
  gameUpdated,
  loadGame,
  gameCreated,
  ownGameAdded,
} from './games.actions';
import { routerNavigatedAction } from '@ngrx/router-store';
import { NavigationEnd } from '@angular/router';
import { Socket } from '@app/io/socket';
import { EventEmitter } from 'eventemitter3';
import { Game } from './models/game';

const fakeGame: Game = {
  state: 'launching',
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
    },
  ],
  launchedAt: new Date('2020-01-02T21:54:23.036Z'),
  gameServer: '5e0145b90ea72823a3059ced',
  mumbleUrl: 'mumble://melkor.tf/tf2pickup/1',
  connectString: 'connect 192.168.1.11:27015; password 0I9vNJTDpC',
  id: 'FAKE_GAME_ID',
};

const initialState = {
  games: {
    ids: ['FAKE_GAME_ID'],
    entities: {
      FAKE_GAME_ID: fakeGame,
    },
  },
  profile: {
    authenticated: 'authenticated',
    player: {
      steamId: '76561198074409147',
      name: 'mały',
      role: 'super-user',
      etf2lProfileId: 112758,
      joinedAt: '2019-08-02T19:01:09.576Z',
      id: 'FAKE_PLAYER_ID',
    },
    hasAcceptedRules: true,
    activeGameId: null,
    bans: [],
  },
};

describe('GamesEffects', () => {
  let actions: ReplaySubject<Action>;
  let effects: GamesEffects;
  let gamesService: jasmine.SpyObj<GamesService>;

  beforeEach(() => {
    actions = new ReplaySubject<Action>(1);

    gamesService = jasmine.createSpyObj<GamesService>(GamesService.name, [
      'requestSubstitute',
      'cancelSubstitutionRequest',
      'replacePlayer',
    ]);
    gamesService.requestSubstitute.and.returnValue(of(null));
    gamesService.cancelSubstitutionRequest.and.returnValue(of(null));
    gamesService.replacePlayer.and.returnValue(of(fakeGame));
  });

  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        GamesEffects,
        provideMockActions(() => actions.asObservable()),
        { provide: GamesService, useValue: gamesService },
        provideMockStore({ initialState }),
        { provide: Socket, useClass: EventEmitter },
      ],
    }),
  );

  beforeEach(() => {
    effects = TestBed.inject(GamesEffects);
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
      effects.loadRoutedGame.subscribe(action =>
        expect(action).toEqual(loadGame({ gameId: 'FAKE_GAME_ID' })),
      );
      actions.next(
        routerNavigatedAction({
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
            event: {} as NavigationEnd,
          },
        }),
      );
    });
  });

  describe('ownGameStarted', () => {
    describe('when the current user is part of the game', () => {
      const game: Game = {
        id: 'FAKE_GAME_ID',
        launchedAt: new Date(),
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
      actions.next(
        requestSubstitute({
          gameId: 'FAKE_GAME_ID',
          playerId: 'FAKE_PLAYER_ID',
        }),
      );
      expect(gamesService.requestSubstitute).toHaveBeenCalledWith(
        'FAKE_GAME_ID',
        'FAKE_PLAYER_ID',
      );
    });
  });

  describe('cancelSubstitutionRequest', () => {
    it('should call service', () => {
      effects.cancelSubstitutionRequest.subscribe();
      actions.next(
        cancelSubstitutionRequest({
          gameId: 'FAKE_GAME_ID',
          playerId: 'FAKE_PLAYER_ID',
        }),
      );
      expect(gamesService.cancelSubstitutionRequest).toHaveBeenCalledWith(
        'FAKE_GAME_ID',
        'FAKE_PLAYER_ID',
      );
    });
  });

  describe('replacePlayer', () => {
    it('should replace the player', () => {
      effects.replacePlayer.subscribe(game =>
        expect(game).toEqual(gameUpdated({ game: fakeGame as any })),
      );
      actions.next(
        replacePlayer({
          gameId: 'FAKE_GAME_ID',
          replaceeId: 'FAKE_REPLACEE_PLAYER_ID',
        }),
      );
      expect(gamesService.replacePlayer).toHaveBeenCalled();
    });
  });
});
