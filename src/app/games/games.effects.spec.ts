import { ReplaySubject, Subject, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { TestBed } from '@angular/core/testing';
import { GamesEffects } from './games.effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { GamesService } from './games.service';
import { GamesEventsService } from './games-events.service';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { requestSubstitute, cancelSubstitutionRequest, replacePlayer, gameUpdated } from './games.actions';

const fakeGame = {
  players: [
    'PLAYER_ID_1',
    'PLAYER_ID_2'
  ],
  state: 'launching',
  number: 453,
  map: 'cp_sunshine',
  teams: {
    0: 'RED',
    1: 'BLU'
  },
  slots: [
    {
      status: 'waiting for substitute',
      connectionStatus: 'offline',
      playerId: 'PLAYER_ID_1',
      gameClass: 'soldier',
      teamId: '0'
    },
    {
      status: 'active',
      connectionStatus: 'offline',
      playerId: 'PLAYER_ID_2',
      gameClass: 'soldier',
      teamId: '1'
    }
  ],
  launchedAt: '2020-01-02T21:54:23.036Z',
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

class GamesEventsServiceStub {
  gameCreated = new Subject<any>();
  gameUpdated = new Subject<any>();
}

const initialState = {
  games: {
    ids: [
      'FAKE_GAME_ID'
    ],
    entities: {
      FAKE_GAME_ID: fakeGame,
    },
  },
};

describe('GamesEffects', () => {
  let actions: ReplaySubject<Action>;
  let effects: GamesEffects;
  let gamesService: GamesServiceStub;

  beforeEach(() => actions = new ReplaySubject<Action>(1));

  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      RouterTestingModule,
    ],
    providers: [
      GamesEffects,
      provideMockActions(() => actions.asObservable()),
      { provide: GamesService, useClass: GamesServiceStub },
      { provide: GamesEventsService, useClass: GamesEventsServiceStub },
      provideMockStore({ initialState }),
    ],
  }));

  beforeEach(() => {
    effects = TestBed.get(GamesEffects);
    gamesService = TestBed.get(GamesService);
  });

  afterEach(() => actions.complete());

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
