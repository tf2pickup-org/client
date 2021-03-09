import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState } from '@app/app.state';
import { State } from './profile.reducer';

export const profile = createFeatureSelector<AppState, State>('profile');

export const currentPlayer = createSelector(profile, profile => profile?.player);

export const isLoggedIn = createSelector(
  profile,
  theProfile => !!theProfile
);

export const isAdmin = createSelector(
  currentPlayer,
  player =>  /^(admin|super-user)$/.test(player?.role)
);

export const isSuperUser = createSelector(
  currentPlayer,
  player => player?.role === 'super-user'
);

export const bans = createSelector(
  profile,
  theProfile => theProfile?.bans
);

export const isBanned = createSelector(
  bans,
  theseBans => theseBans?.length > 0
);

export const twitchTvUser = createSelector(
  currentPlayer,
  player => player?.twitchTvUser
);

export const preferences = createSelector(
  profile,
  profile => profile?.preferences
);
