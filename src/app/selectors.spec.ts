import { queueLocked, canSubstituteInGame } from './selectors';

describe('root selectors', () => {
  describe('queueLocked', () => {
    it('should return true if the user is not logged in', () => {
      expect(queueLocked.projector(null, null)).toBe(true);
    });

    it('should return true if the user has an active game', () => {
      expect(queueLocked.projector({ }, { })).toBe(true);
    });

    it('should return true if the user has active bans', () => {
      expect(queueLocked.projector({ bans: [{}] }, null)).toBe(true);
    });
  });

  describe('canSubstituteInGame', () => {
    it('should return false if the given game is not running', () => {
      expect(canSubstituteInGame('FAKE_GAME_ID').projector(false, false, null, null)).toBe(false);
    });

    it('should return false if the current user is banned', () => {
      expect(canSubstituteInGame('FAKE_GAME_ID').projector(true, true, null, null)).toBe(false);
    });

    it('should return true if the current user is not playing any game', () => {
      expect(canSubstituteInGame('FAKE_GAME_ID').projector(true, false, null, { id: 'FAKE_GAME_ID' })).toBe(true);
    });

    it('should return false if the current user is playing a game', () => {
      expect(canSubstituteInGame('FAKE_GAME_ID').projector(true, false, { id: 'SOME_OTHER_GAME' }, { id: 'FAKE_GAME_ID' })).toBe(false);
    });

    it('should return true if player is trying to sub in the same game', () => {
      expect(canSubstituteInGame('FAKE_GAME_ID').projector(true, false, { id: 'FAKE_GAME_ID' }, { id: 'FAKE_GAME_ID' })).toBe(true);
    });
  });
});
