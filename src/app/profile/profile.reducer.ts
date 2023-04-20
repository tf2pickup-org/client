import { Profile } from './models/profile';
import { createReducer, Action, on } from '@ngrx/store';
import {
  profileLoaded,
  rulesAccepted,
  profileUpdated,
  preferencesUpdated,
  signedOut,
} from './profile.actions';

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
  on(
    signedOut,
    () => ({ authenticated: 'not authenticated' } as NotAuthenticatedState),
  ),
  on(rulesAccepted, state => ({ ...state, hasAcceptedRules: true })),
  on(profileUpdated, (state, { profileChanges }) => ({
    ...state,
    ...profileChanges,
  })),
  on(preferencesUpdated, (state, { preferences }) => ({
    ...state,
    preferences,
  })),
);

export const reducer = (state: State | undefined, action: Action) =>
  profileReducer(state, action);
