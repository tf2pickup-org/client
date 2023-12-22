import { Player } from '@app/players/models/player';
import { TwitchTvProfile } from '@app/players/models/twitch-tv-profile';
import { Tf2ClassName } from '@app/shared/models/tf2-class-name';
import {
  isAdmin,
  isSuperUser,
  bans,
  isBanned,
  isLoggedIn,
  currentPlayer,
  currentPlayerId,
  linkedProfiles,
  twitchTvProfile,
  activeGameId,
  isPlayingGame,
  restrictions,
} from './profile.selectors';
import { State } from './profile.reducer';
import { PlayerBan } from '@app/players/models/player-ban';

describe('currentPlayer', () => {
  describe('when authenticated', () => {
    it("should return the player's profile", () => {
      expect(
        currentPlayer.projector({
          authenticated: 'authenticated',
          player: {
            id: 'FAKE_PLAYER_ID',
          } as Player,
        } as State),
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
    expect(
      currentPlayerId.projector({ id: 'FAKE_PLAYER_ID' } as Player),
    ).toEqual('FAKE_PLAYER_ID');
  });
});

describe('isLoggedIn', () => {
  describe('when the user is logged in', () => {
    it('should return true', () => {
      expect(
        isLoggedIn.projector({ authenticated: 'authenticated' } as State),
      ).toBe(true);
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
    expect(isAdmin.projector({ roles: [] } as Player)).toBe(false);
    expect(isAdmin.projector({ roles: ['admin'] } as Player)).toBe(true);
  });
});

describe('isSuperUser', () => {
  it('should return the correct value', () => {
    expect(isSuperUser.projector(null)).toBeFalsy();
    expect(isSuperUser.projector({ roles: [] } as Player)).toBe(false);
    expect(isSuperUser.projector({ roles: ['super user'] } as Player)).toBe(
      true,
    );
    expect(isSuperUser.projector({ roles: ['admin'] } as Player)).toBe(false);
  });
});

describe('bans', () => {
  it('should return player bans', () => {
    expect(bans.projector({ authenticated: 'unknown' })).toEqual([]);
    expect(bans.projector({ authenticated: 'not authenticated' })).toEqual([]);
    expect(
      bans.projector({
        authenticated: 'authenticated',
        bans: [{ id: '1' } as PlayerBan],
      } as State),
    ).toEqual([{ id: '1' } as any]);
  });
});

describe('isBanned', () => {
  it('should return true if the player has at least one ban', () => {
    expect(isBanned.projector([])).toBe(false);
    expect(isBanned.projector([{} as PlayerBan])).toBe(true);
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
            } as TwitchTvProfile,
          ],
        } as State),
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

describe('restrictions', () => {
  describe('when authenticated', () => {
    it('should return linked profiles', () => {
      expect(
        restrictions.projector({
          authenticated: 'authenticated',
          restrictions: [
            {
              reason: 'account needs review',
              gameClasses: [Tf2ClassName.soldier],
            },
          ],
        } as State),
      ).toEqual([
        {
          reason: 'account needs review',
          gameClasses: [Tf2ClassName.soldier],
        },
      ]);
    });
  });

  describe('when not authenticated', () => {
    it('should return an empty array', () => {
      expect(
        restrictions.projector({
          authenticated: 'authenticated',
          restrictions: [],
        } as State),
      ).toEqual([]);
    });
  });
});

describe('twitchTvProfile', () => {
  it('should find the twitch.tv profile', () => {
    expect(
      twitchTvProfile.projector([
        {
          provider: 'twitch.tv',
        } as TwitchTvProfile,
      ]),
    ).toEqual({
      provider: 'twitch.tv',
    } as TwitchTvProfile);
  });
});

describe('activeGameId', () => {
  describe('when the user is not logged in', () => {
    it('should return null', () => {
      expect(
        activeGameId.projector({
          authenticated: 'not authenticated',
        }),
      ).toBe(null);
    });
  });

  describe('when the user is logged in', () => {
    describe('and not playing any game', () => {
      it('should return null', () => {
        expect(
          activeGameId.projector({
            authenticated: 'authenticated',
          } as State),
        ).toBe(null);
      });
    });

    describe('and playing a game', () => {
      it('should return the game id', () => {
        expect(
          activeGameId.projector({
            authenticated: 'authenticated',
            activeGameId: 'FAKE_GAME_ID',
          } as State),
        ).toEqual('FAKE_GAME_ID');
      });
    });
  });
});

describe('isPlayingGame', () => {
  describe('when the user is not playing any game', () => {
    it('should return false', () => {
      expect(isPlayingGame.projector(null)).toBe(false);
    });
  });

  describe('when the user is playing a game', () => {
    it('should return true', () => {
      expect(isPlayingGame.projector('FAKE_GAME_ID')).toBe(true);
    });
  });
});
