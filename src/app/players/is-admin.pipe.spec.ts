import { IsAdminPipe } from './is-admin.pipe';
import { Player } from './models/player';

describe(IsAdminPipe.name, () => {
  it('create an instance', () => {
    const pipe = new IsAdminPipe();
    expect(pipe).toBeTruthy();
  });

  describe('when the player is null', () => {
    it('should return false', () => {
      const pipe = new IsAdminPipe();
      expect(pipe.transform(null)).toBe(false);
    });
  });

  describe('when the player has no assigned roles', () => {
    it('should return false', () => {
      const pipe = new IsAdminPipe();
      expect(pipe.transform({} as Player)).toBe(false);
    });
  });

  describe('when the player is not an admin', () => {
    it('should return false', () => {
      const pipe = new IsAdminPipe();
      expect(pipe.transform({ roles: [] } as Player)).toBe(false);
    });
  });

  describe('when the player is an admin', () => {
    it('should return true', () => {
      const pipe = new IsAdminPipe();
      expect(pipe.transform({ roles: ['admin'] } as Player)).toBe(true);
    });
  });
});
