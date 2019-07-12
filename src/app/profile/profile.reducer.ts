import { Profile } from './models/profile';
import { createReducer, Action, on } from '@ngrx/store';
import { profileLoaded } from './profile.actions';

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
);

export function reducer(state: State | undefined, action: Action) {
  return profileReducer(state, action);
}
