import { gameById, activeGames, playerSlot, isPlayingGame, isGameRunning } from './games.selectors';

describe('games selectors', () => {
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

  describe('isPlayingGame', () => {
    it('should return true if there is an active game', () => {
      expect(isPlayingGame.projector({ id: 1, number: 1, state: 'started' })).toBe(true);
    });

    it('should return false if there is no active game for the current user', () => {
      expect(isPlayingGame.projector(null)).toBe(false);
    });
  });

  describe('playerSlot', () => {
    it('should find the players slot', () => {
      expect(playerSlot('FAKE_GAME_ID', 'FAKE_PLAYER_ID').projector({
        id: 'FAKE_GAME_ID',
        slots: [
          { playerId: 'FAKE_PLAYER_ID' },
        ],
      })).toBeDefined();
    });
  });

  describe('isGameRunning', () => {
    it('should return true if the game is launching', () => {
      expect(isGameRunning('FAKE_GAME_ID').projector({ state: 'launching' })).toBe(true);
    });

    it('should return true if the game has started', () => {
      expect(isGameRunning('FAKE_GAME_ID').projector({ state: 'started' })).toBe(true);
    });

    it('should return false if the game has ended', () => {
      expect(isGameRunning('FAKE_GAME_ID').projector({ state: 'ended' })).toBe(false);
    });

    it('should return false if the game has been interrupted', () => {
      expect(isGameRunning('FAKE_GAME_ID').projector({ state: 'interrupted' })).toBe(false);
    });
  });
});
