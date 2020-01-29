import { gameById, activeGames, playerSlot, isPlayingGame, isGameRunning, isMyGame } from './games.selectors';
import { Game } from './models/game';

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

  describe('isMyGame', () => {
    const game: Partial<Game> = {
      id: 'FAKE_GAME_ID',
      slots: [
        {
          playerId: 'ACTIVE_PLAYER_ID',
          teamId: '1',
          gameClass: 'soldier',
          connectionStatus: 'offline',
          status: 'active',
        },
        {
          playerId: 'REPLACED_PLAYER_ID',
          teamId: '2',
          gameClass: 'soldier',
          connectionStatus: 'offline',
          status: 'replaced',
        },
      ],
    };

    it('should return false if the user is not logged in', () => {
      expect(isMyGame('FAKE_GAME_ID').projector(null, game)).toBe(false);
    });

    it('should return false if the user is not part of the game', () => {
      expect(isMyGame('FAKE_GAME_ID').projector({ id: 'SOME_OTHER_USER' }, game)).toBe(false);
    });

    it('should return false if the user has been replaced', () => {
      expect(isMyGame('FAKE_GAME_ID').projector({ id: 'REPLACED_PLAYER_ID' }, game)).toBe(false);
    });

    it('should return true if the user is part of the game', () => {
      expect(isMyGame('FAKE_GAME_ID').projector({ id: 'ACTIVE_PLAYER_ID' }, game)).toBe(true);
    });
  });
});
