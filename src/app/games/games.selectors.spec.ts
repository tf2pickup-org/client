import { gameById, activeGames, playerSlot, isPlayingGame, isGameRunning, isMyGame, mumbleUrl, gameScore } from './games.selectors';
import { Game } from './models/game';
import { Profile } from '@app/profile/models/profile';

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
          { player: 'FAKE_PLAYER_ID' },
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
          player: 'ACTIVE_PLAYER_ID',
          team: 'blu',
          gameClass: 'soldier',
          connectionStatus: 'offline',
          status: 'active',
        },
        {
          player: 'REPLACED_PLAYER_ID',
          team: 'red',
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

  describe('mumbleUrl', () => {
    const game: Partial<Game> = {
      slots: [
        {
          player: 'FAKE_PLAYER_ID',
          team: 'red',
          gameClass: 'soldier',
          connectionStatus: 'offline',
          status: 'active',
        },
      ],
      mumbleUrl: 'mumble://melkor.tf/tf2pickup/5',
    };

    const profile: Partial<Profile> = {
      id: 'FAKE_PLAYER_ID',
      name: 'FAKE_PLAYER_NAME',
    };

    it('should construct the proper mumble url for the given game', () => {
      expect(mumbleUrl('FAKE_GAME_ID').projector(game, profile)).toEqual('mumble://FAKE_PLAYER_NAME@melkor.tf/tf2pickup/5/RED');
    });

    it('should return null if the user is not logged in', () => {
      expect(mumbleUrl('FAKE_GAME_ID').projector(game, null)).toBe(null);
    });

    it('should return null if the mumble url is not defined', () => {
      expect(mumbleUrl('FAKE_GAME_ID').projector({ ...game, mumbleUrl: null }, profile)).toBe(null);
    });

    it('should replace username spaces with underscores', () => {
      expect(mumbleUrl('FAKE_GAME_ID').projector(game, { ...profile, name: 'name with  spaces' }))
        .toEqual('mumble://name_with_spaces@melkor.tf/tf2pickup/5/RED');
    });
  });

  describe('gameScore', () => {
    it('should return score for RED', () => {
      expect(gameScore('FAKE_GAME_ID', 'red').projector({
        score: { red: 5, blu: 3 },
      })).toBe(5);
    });

    it('should return score for BLU', () => {
      expect(gameScore('FAKE_GAME_ID', 'blu').projector({
        score: { red: 5, blu: 3 },
      })).toBe(3);
    });

    it('should return null if there is no score reported', () => {
      expect(gameScore('FAKE_GAME_ID', 'red').projector({ })).toBeUndefined();
    });
  });
});
