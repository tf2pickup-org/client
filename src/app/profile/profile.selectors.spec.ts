import { isAdmin, isSuperUser, bans, isBanned } from './profile.selectors';

describe('profile selectors', () => {
  describe('isAdmin', () => {
    it('should return the correct value', () => {
      expect(isAdmin.projector(null)).toBeFalsy();
      expect(isAdmin.projector({ })).toBe(false);
      expect(isAdmin.projector({ role: 'whatever' })).toBe(false);
      expect(isAdmin.projector({ role: 'admin' })).toBe(true);
      expect(isAdmin.projector({ role: 'super-user' })).toBe(true);
    });
  });

  describe('isSuperUser', () => {
    it('should return the correct value', () => {
      expect(isSuperUser.projector(null)).toBeFalsy();
      expect(isSuperUser.projector({ })).toBe(false);
      expect(isSuperUser.projector({ role: 'something' })).toBe(false);
      expect(isSuperUser.projector({ role: 'super-user' })).toBe(true);
      expect(isSuperUser.projector({ role: 'admin' })).toBe(false);
    });
  });

  describe('bans', () => {
    it('should return player bans', () => {
      expect(bans.projector(undefined)).toBeUndefined();
      expect(bans.projector(null)).toBeUndefined();
      expect(bans.projector({ bans: [] })).toEqual([]);
    });
  });

  describe('isBanned', () => {
    it('should return true if the player has at least one ban', () => {
      expect(isBanned.projector(null)).toBe(false);
      expect(isBanned.projector([])).toBe(false);
      expect(isBanned.projector([ { } ])).toBe(true);
    });
  });
});
