import { EntityState } from '@ngrx/entity';
import { Player } from './models/player';
import { adapter } from './player.adapter';
import { createReducer, Action, on } from '@ngrx/store';
import { playersLoaded } from './player.actions';

export interface State extends EntityState<Player> { }

const initialState: State = adapter.getInitialState();

const playerReducer = createReducer(
  initialState,
  on(playersLoaded, (state, { players }) => adapter.addAll(players, state)),
);

export function reducer(state: State | undefined, action: Action) {
  return playerReducer(state, action);
}
