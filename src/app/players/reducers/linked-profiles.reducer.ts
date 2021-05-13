import { LinkedProfile } from '../models/linked-profile';
import { EntityState } from '@ngrx/entity';
import { linkedProfilesAdapter as adapter } from '../adapters';
import { createReducer, Action, on } from '@ngrx/store';
import { linkedProfilesLoaded } from '../actions';

interface LinkedProfiles {
  playerId: string;
  linkedProfiles: LinkedProfile[];
}

export interface State extends EntityState<LinkedProfiles> {}

const initialState: State = adapter.getInitialState();

const linkedProfilesReducer = createReducer(
  initialState,
  on(linkedProfilesLoaded, (state, { linkedProfiles }) =>
    adapter.upsertOne(linkedProfiles, state),
  ),
);

export const reducer = (state: State, action: Action) =>
  linkedProfilesReducer(state, action);
