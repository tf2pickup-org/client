import { Profile } from './models/profile';
import { createReducer, Action, on } from '@ngrx/store';
import {
  profileLoaded,
  rulesAccepted,
  profileUpdated,
  preferencesUpdated,
  linkedProfilesLoaded,
} from './profile.actions';

// export type State = Profile;
interface AuthenticatedState extends Profile {
  authenticated: 'authenticated';
}

interface NotAuthenticatedState {
  authenticated: 'not authenticated';
}

interface UnknownState {
  authenticated: 'unknown';
}

export type State = UnknownState | NotAuthenticatedState | AuthenticatedState;

export const initialState: State = {
  authenticated: 'unknown',
};

const profileReducer = createReducer<State>(
  initialState,
  on(profileLoaded, (state, { profile }) => ({
    ...profile,
    authenticated: 'authenticated',
  })),
  on(rulesAccepted, state => ({ ...state, hasAcceptedRules: true })),
  on(profileUpdated, (state, { profileChanges }) => ({
    ...state,
    ...profileChanges,
  })),
  on(preferencesUpdated, (state, { preferences }) => ({
    ...state,
    preferences,
  })),
  on(linkedProfilesLoaded, (state, { linkedProfiles }) => ({
    ...state,
    linkedProfiles,
  })),
);

export const reducer = (state: State | undefined, action: Action) =>
  profileReducer(state, action);
