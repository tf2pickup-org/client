import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState } from '@app/app.state';
import { State } from './profile.reducer';

export const profile = createFeatureSelector<AppState, State>('profile');

export const currentPlayer = createSelector(profile, profile =>
  profile.authenticated === 'authenticated' ? profile.player : null,
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

export const bans = createSelector(profile, profile =>
  profile.authenticated === 'authenticated' ? profile.bans : [],
);

export const isBanned = createSelector(bans, bans => bans.length > 0);

export const twitchTvUser = createSelector(
  currentPlayer,
  player => player?.twitchTvUser,
);

export const preferences = createSelector(profile, profile =>
  profile.authenticated === 'authenticated' ? profile.preferences : {},
);
