import { queueLocked } from './selectors';

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
});
