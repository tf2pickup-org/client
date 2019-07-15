import { EntityState } from '@ngrx/entity';
import { Player } from './models/player';
import { adapter } from './players.adapter';
import { createReducer, Action, on } from '@ngrx/store';
import { playerLoaded } from './players.actions';

export interface State extends EntityState<Player> { }

const initialState: State = adapter.getInitialState();

const playerReducer = createReducer(
  initialState,
  on(playerLoaded, (state, { player }) => adapter.upsertOne(player, state)),
);

export function reducer(state: State | undefined, action: Action) {
  return playerReducer(state, action);
}
