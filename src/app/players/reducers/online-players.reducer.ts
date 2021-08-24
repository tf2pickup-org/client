import { EntityState } from '@ngrx/entity';
import { Player } from '../models/player';
import { onlinePlayersAdapter } from '../adapters';
import {
  onlinePlayersLoaded,
  playerConnected,
  playerDisconnected,
} from '../actions';
import { Action, createReducer, on } from '@ngrx/store';

export interface State extends EntityState<Player> {
  loaded: boolean;
}

const initialState: State = onlinePlayersAdapter.getInitialState({
  loaded: false,
});

const onlinePlayersReducer = createReducer(
  initialState,
  on(onlinePlayersLoaded, (state, { players }) => ({
    ...onlinePlayersAdapter.setAll(players, state),
    loaded: true,
  })),
  on(playerConnected, (state, { player }) =>
    onlinePlayersAdapter.upsertOne(player, state),
  ),
  on(playerDisconnected, (state, { player }) =>
    onlinePlayersAdapter.removeOne(player.id, state),
  ),
);

export const reducer = (state: State, action: Action) =>
  onlinePlayersReducer(state, action);
