import { Player } from '@app/players/models/player';
import { TwitchTvProfile } from '@app/players/models/twitch-tv-profile';
import {
  isAdmin,
  isSuperUser,
  bans,
  isBanned,
  isLoggedIn,
  currentPlayer,
  currentPlayerId,
  linkedProfiles,
} from './profile.selectors';

describe('currentPlayer', () => {
  describe('when authenticated', () => {
    it("should return the player's profile", () => {
      expect(
        currentPlayer.projector({
          authenticated: 'authenticated',
          player: {
            id: 'FAKE_PLAYER_ID',
          },
        }),
      ).toEqual({
        id: 'FAKE_PLAYER_ID',
      } as Player);
    });
  });

  describe('when not authenticated', () => {
    it('should return null', () => {
      expect(
        currentPlayer.projector({ authenticated: 'not authenticated' }),
      ).toBe(null);
    });
  });
});

describe('currentPlayerId', () => {
  it("should return current player's id", () => {
    expect(currentPlayerId.projector({ id: 'FAKE_PLAYER_ID' })).toEqual(
      'FAKE_PLAYER_ID',
    );
  });
});

describe('isLoggedIn', () => {
  describe('when the user is logged in', () => {
    it('should return true', () => {
      expect(isLoggedIn.projector({ authenticated: 'authenticated' })).toBe(
        true,
      );
    });
  });

  describe('when the user is not logged in', () => {
    it('should return false', () => {
      expect(isLoggedIn.projector({ authenticated: 'not authenticated' })).toBe(
        false,
      );
    });
  });
});

describe('isAdmin', () => {
  it('should return the correct value', () => {
    expect(isAdmin.projector(null)).toBeFalsy();
    expect(isAdmin.projector({ roles: [] })).toBe(false);
    expect(isAdmin.projector({ roles: ['whatever'] })).toBe(false);
    expect(isAdmin.projector({ roles: ['admin'] })).toBe(true);
  });
});

describe('isSuperUser', () => {
  it('should return the correct value', () => {
    expect(isSuperUser.projector(null)).toBeFalsy();
    expect(isSuperUser.projector({ roles: [] })).toBe(false);
    expect(isSuperUser.projector({ roles: ['something'] })).toBe(false);
    expect(isSuperUser.projector({ roles: ['super user'] })).toBe(true);
    expect(isSuperUser.projector({ roles: ['admin'] })).toBe(false);
  });
});

describe('bans', () => {
  it('should return player bans', () => {
    expect(bans.projector({ authenticated: 'unknown' })).toEqual([]);
    expect(bans.projector({ authenticated: 'not authenticated' })).toEqual([]);
    expect(
      bans.projector({ authenticated: 'authenticated', bans: [{ id: '1' }] }),
    ).toEqual([{ id: '1' } as any]);
  });
});

describe('isBanned', () => {
  it('should return true if the player has at least one ban', () => {
    expect(isBanned.projector([])).toBe(false);
    expect(isBanned.projector([{}])).toBe(true);
  });
});

describe('linkedProfiles', () => {
  describe('when authenticated', () => {
    it('should return linked profiles', () => {
      expect(
        linkedProfiles.projector({
          authenticated: 'authenticated',
          linkedProfiles: [
            {
              provider: 'twitch.tv',
            },
          ],
        }),
      ).toEqual([
        {
          provider: 'twitch.tv',
        } as TwitchTvProfile,
      ]);
    });
  });

  describe('when not authenticated', () => {
    it('should return an empty array', () => {
      expect(
        linkedProfiles.projector({
          authenticated: 'not authenticated',
        }),
      ).toEqual([]);
    });
  });
});
