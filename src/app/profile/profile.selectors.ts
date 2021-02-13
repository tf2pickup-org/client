import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState } from '@app/app.state';
import { State } from './profile.reducer';

export const profile = createFeatureSelector<AppState, State>('profile');

export const isLoggedIn = createSelector(
  profile,
  theProfile => !!theProfile
);

export const isAdmin = createSelector(
  profile,
  theProfile =>  /^(admin|super-user)$/.test(theProfile?.role)
);

export const isSuperUser = createSelector(
  profile,
  theProfile => theProfile?.role === 'super-user'
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
  profile,
  theProfile => theProfile?.twitchTvUser
);

export const preferences = createSelector(
  profile,
  profile => profile?.preferences
);
