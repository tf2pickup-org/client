import { EntityState } from '@ngrx/entity';
import { Player } from './models/player';
import { adapter } from './players.adapter';
import { createReducer, Action, on } from '@ngrx/store';
import { playerLoaded, editPlayer, playerUpdated, playerEdited } from './players.actions';

export interface State extends EntityState<Player> {
  locked: boolean; // is player editing enabled or not
}

const initialState: State = adapter.getInitialState({
  locked: false,
});

const playerReducer = createReducer(
  initialState,
  on(playerLoaded, (state, { player }) => adapter.upsertOne(player, state)),
  on(editPlayer, state => ({ ...state, locked: true })),
  on(playerUpdated, (state, { player }) => adapter.upsertOne(player, state)),
  on(playerEdited, (state, { player }) => ({ ...adapter.upsertOne(player, state), locked: false })),
);

export function reducer(state: State | undefined, action: Action) {
  return playerReducer(state, action);
}
