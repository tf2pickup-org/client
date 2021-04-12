import { Player } from './models/player';
import { HasBadgePipe } from './has-badge.pipe';

describe(HasBadgePipe.name, () => {
  it('create an instance', () => {
    const pipe = new HasBadgePipe();
    expect(pipe).toBeTruthy();
  });

  describe('when the player does not have the badge', () => {
    it('should return false', () => {
      const pipe = new HasBadgePipe();
      expect(pipe.transform({ roles: [] } as Player)).toBe(false);
    });
  });

  describe('when the player has the badge', () => {
    it('should return true', () => {
      const pipe = new HasBadgePipe();
      expect(pipe.transform({ roles: ['admin'] } as Player)).toBe(true);
    });
  });
});
