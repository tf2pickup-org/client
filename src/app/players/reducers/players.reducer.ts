import { EntityState } from '@ngrx/entity';
import { Player } from '../models/player';
import { playersAdapter as adapter } from '../adapters';
import { createReducer, Action, on } from '@ngrx/store';
import { playerLoaded, playerUpdated, playerEdited, playersLoaded, setPlayerName, setPlayerRole } from '../actions';

export interface State extends EntityState<Player> {
  locked: boolean; // is player editing enabled or not
}

const initialState: State = adapter.getInitialState({
  locked: false,
});

const playerReducer = createReducer(
  initialState,
  on(playerLoaded, (state, { player }) => adapter.upsertOne(player, state)),
  on(playerUpdated, (state, { player }) => adapter.upsertOne(player, state)),

  on(setPlayerName, state => ({ ...state, locked: true })),
  on(setPlayerRole, state => ({ ...state, locked: true })),
  on(playerEdited, (state, { player }) => ({ ...adapter.upsertOne(player, state), locked: false })),

  on(playersLoaded, (state, { players }) => adapter.upsertMany(players, state)),
);

export const reducer = (state: State | undefined, action: Action) => playerReducer(state, action);
