import { Profile } from './models/profile';
import { createReducer, Action, on } from '@ngrx/store';
import { profileLoaded, rulesAccepted, profileUpdated } from './profile.actions';

export interface State {
  loaded: boolean;
  profile?: Profile;
}

export const initialState: State = {
  loaded: false,
};

const profileReducer = createReducer(
  initialState,
  on(profileLoaded, (state, { profile }) => ({ ...state, profile, loaded: true })),
  on(rulesAccepted, state => ({ ...state, profile: { ...state.profile, hasAcceptedRules: true }})),
  on(profileUpdated, (state, { profileChanges }) => ({ ...state, profile: { ...state.profile, ...profileChanges } })),
);

export function reducer(state: State | undefined, action: Action) {
  return profileReducer(state, action);
}
