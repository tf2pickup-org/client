import { EntityState } from '@ngrx/entity';
import { Player } from '../models/player';
import { playersAdapter as adapter } from '../adapters';
import { createReducer, Action, on } from '@ngrx/store';
import { playerLoaded, playerUpdated, playerEdited, playersLoaded } from '../actions';

export interface State extends EntityState<Player> { }

const initialState: State = adapter.getInitialState();

const playerReducer = createReducer(
  initialState,
  on(playerLoaded, (state, { player }) => adapter.upsertOne(player, state)),
  on(playerUpdated, (state, { player }) => adapter.upsertOne(player, state)),
  on(playerEdited, (state, { player }) => adapter.upsertOne(player, state)),
  on(playersLoaded, (state, { players }) => adapter.upsertMany(players, state)),
);

export const reducer = (state: State, action: Action) => playerReducer(state, action);
