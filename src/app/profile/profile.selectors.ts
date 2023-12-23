import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProfileState } from './profile.reducer';

export const profile = createFeatureSelector<ProfileState>('profile');

// skipcq: JS-0229
export const currentPlayer = createSelector(profile, profile =>
  profile.authenticated === 'authenticated' ? profile.player : null,
);

export const currentPlayerId = createSelector(
  currentPlayer,
  currentPlayer => currentPlayer?.id,
);

export const isLoggedIn = createSelector(
  profile,
  profile => profile.authenticated === 'authenticated',
);

export const isAdmin = createSelector(currentPlayer, player =>
  player?.roles.includes('admin'),
);

export const isSuperUser = createSelector(currentPlayer, player =>
  player?.roles.includes('super user'),
);

// skipcq: JS-0229
export const bans = createSelector(profile, profile =>
  profile.authenticated === 'authenticated' ? profile.bans : [],
);

export const isBanned = createSelector(bans, bans => bans.length > 0);

// skipcq: JS-0229
export const preferences = createSelector(profile, profile =>
  profile.authenticated === 'authenticated' ? profile.preferences : {},
);

// skipcq: JS-0229
export const linkedProfiles = createSelector(profile, profile =>
  profile.authenticated === 'authenticated' ? profile.linkedProfiles : [],
);

// skipcq: JS-0229
export const restrictions = createSelector(profile, profile =>
  profile.authenticated === 'authenticated' ? profile.restrictions : [],
);

export const twitchTvProfile = createSelector(linkedProfiles, linkedProfiles =>
  linkedProfiles?.find(p => p.provider === 'twitch.tv'),
);

// skipcq: JS-0229
export const activeGameId = createSelector(profile, profile =>
  profile.authenticated === 'authenticated'
    ? profile.activeGameId ?? null
    : null,
);

export const isPlayingGame = createSelector(
  activeGameId,
  gameId => gameId !== null,
);
