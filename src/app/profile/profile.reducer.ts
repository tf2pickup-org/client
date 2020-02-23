import { Profile } from './models/profile';
import { createReducer, Action, on } from '@ngrx/store';
import { profileLoaded, rulesAccepted, profileUpdated } from './profile.actions';

export type State = Profile;

export const initialState: State = null;

const profileReducer = createReducer(
  initialState,
  on(profileLoaded, (state, { profile }) => ({ ...profile })),
  on(rulesAccepted, state => ({ ...state, hasAcceptedRules: true })),
  on(profileUpdated, (state, { profileChanges }) => ({ ...state, ...profileChanges })),
);

export function reducer(state: State | undefined, action: Action) {
  return profileReducer(state, action);
}
