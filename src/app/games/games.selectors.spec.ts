/* eslint-disable id-blacklist */
/* eslint-disable @typescript-eslint/naming-convention */
import { gameById, activeGames, isPlayingGame, activeGame, activeGameId } from './games.selectors';
import { Game } from './models/game';

describe('gameById', () => {
  it('should select the given game by its id', () => {
    expect(gameById('FAKE_ID').projector({
      FAKE_ID: { id: 'FAKE_ID', number: 2 },
    })).toEqual({ id: 'FAKE_ID', number: 2 } as any);
  });
});

describe('activeGames', () => {
  it('should select only  active games', () => {
    expect(activeGames.projector([
      { id: '1', number: 1, state: 'ended' },
      { id: '2', number: 2, state: 'started' },
      { id: '3', number: 3, state: 'launching' },
    ])).toEqual([
      { id: '2', number: 2, state: 'started' },
      { id: '3', number: 3, state: 'launching' },
    ] as any);
  });
});

describe('activeGame', () => {
  describe('when the user is not logged in', () => {
    it('should return null', () => {
      expect(activeGame.projector(null, [])).toEqual(null);
    });
  });

  describe('when there are no active games', () => {
    it('should return undefined', () => {
      expect(activeGame.projector({ id: 'FAKE_PLAYER_ID' }, [])).toBe(undefined);
    });
  });

  describe('when there is an active game', () => {
    const game: Game = {
      id: '1',
      launchedAt: new Date(),
      number: 1,
      state: 'started',
      slots: [
        {
          player: 'FAKE_PLAYER_ID',
          team: 'red',
          gameClass: 'soldier',
          connectionStatus: 'connected',
          status: 'active',
        },
      ],
      map: 'cp_badlands',
      mumbleUrl: 'FAKE_MUMBLE_URL',
    };

    it('should return the active game', () => {
      expect(activeGame.projector({ id: 'FAKE_PLAYER_ID' }, [ game ])).toEqual(game);
    });
  });
});

describe('activeGameId', () => {
  describe('when there is no active game', () => {
    it('should return undefined', () => {
      expect(activeGameId.projector(null)).toBe(undefined);
    });
  });

  describe('when the active game is given', () => {
    it('should extract the game\'s id', () => {
      expect(activeGameId.projector({ id: 'FAKE_GAME_ID' })).toEqual('FAKE_GAME_ID');
    });
  });
});

describe('isPlayingGame', () => {
  it('should return true if there is an active game', () => {
    expect(isPlayingGame.projector({ id: 1, number: 1, state: 'started' })).toBe(true);
  });

  it('should return false if there is no active game for the current user', () => {
    expect(isPlayingGame.projector(null)).toBe(false);
  });
});
