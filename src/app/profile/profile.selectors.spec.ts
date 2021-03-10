import { isAdmin, isSuperUser, bans, isBanned, twitchTvUser, isLoggedIn } from './profile.selectors';

describe('isLoggedIn', () => {
  describe('when the user is logged in', () => {
    it('should return true', () => {
      expect(isLoggedIn.projector({ authenticated: 'authenticated' })).toBe(true);
    });
  });

  describe('when the user is not logged in', () => {
    it('should return false', () => {
      expect(isLoggedIn.projector({ authenticated: 'not authenticated' })).toBe(false);
    });
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
    expect(bans.projector({ authenticated: 'unknown' })).toEqual([]);
    expect(bans.projector({ authenticated: 'not authenticated' })).toEqual([]);
    expect(bans.projector({ authenticated: 'authenticated', bans: [{ id: '1' }] })).toEqual([{ id: '1' } as any]);
  });
});

describe('isBanned', () => {
  it('should return true if the player has at least one ban', () => {
    expect(isBanned.projector([])).toBe(false);
    expect(isBanned.projector([ { } ])).toBe(true);
  });
});

describe('twitchTvUser', () => {
  it('should return twitch.tv user profile', () => {
    expect(twitchTvUser.projector(null)).toBe(undefined);
    expect(twitchTvUser.projector({  })).toBe(undefined);
    expect(twitchTvUser.projector({ twitchTvUser: { displayName: 'foo' } })).toEqual({ displayName: 'foo' } as any);
  });
});
