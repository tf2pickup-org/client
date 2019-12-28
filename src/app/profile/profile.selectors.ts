import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState } from '@app/app.state';
import { State } from './profile.reducer';

const profileFeature = createFeatureSelector<AppState, State>('profile');

export const isProfileLoaded = createSelector(profileFeature, feature => feature.loaded);
export const profile = createSelector(profileFeature, feature => feature.profile);

export const isAdmin = createSelector(
  profile,
  theProfile => theProfile && (theProfile.role === 'admin' || theProfile.role === 'super-user'),
);

export const isSuperUser = createSelector(
  profile,
  theProfile => theProfile && theProfile.role === 'super-user'
);
