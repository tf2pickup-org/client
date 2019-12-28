import { isProfileLoaded, isAdmin } from './profile.selectors';

describe('profile selectors', () => {
  describe('isProfileLoaded', () => {
    it('should return the correct value', () => {
      expect(isProfileLoaded.projector({ loaded: false })).toBe(false);
      expect(isProfileLoaded.projector({ loaded: true })).toBe(true);
    });
  });

  describe('isAdmin', () => {
    it('should return the correct value', () => {
      expect(isAdmin.projector(null)).toBeFalsy();
      expect(isAdmin.projector({ })).toBe(false);
      expect(isAdmin.projector({ role: 'whatever' })).toBe(false);
      expect(isAdmin.projector({ role: 'admin' })).toBe(true);
      expect(isAdmin.projector({ role: 'super-user' })).toBe(true);
    });
  });
});
