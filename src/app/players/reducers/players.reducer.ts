import { EntityState } from '@ngrx/entity';
import { Player } from '../models/player';
import { playersAdapter as adapter } from '../adapters';
import { createReducer, Action, on } from '@ngrx/store';
import {
  playerLoaded,
  playerUpdated,
  playerEdited,
  playersLoaded,
} from '../actions';
import { queueLoaded, queueSlotsUpdated } from '@app/queue/queue.actions';

export interface State extends EntityState<Player> {}

const initialState: State = adapter.getInitialState();

const playerReducer = createReducer(
  initialState,
  on(playerLoaded, (state, { player }) => adapter.upsertOne(player, state)),
  on(playerUpdated, (state, { player }) => adapter.upsertOne(player, state)),
  on(playerEdited, (state, { player }) => adapter.upsertOne(player, state)),
  on(playersLoaded, (state, { players }) => adapter.upsertMany(players, state)),
  on(queueLoaded, (state, { queue }) =>
    adapter.upsertMany(
      queue.slots.filter(s => !!s.player).map(s => s.player),
      state,
    ),
  ),
  on(queueSlotsUpdated, (state, { slots }) =>
    adapter.upsertMany(
      slots.filter(s => !!s.player).map(s => s.player),
      state,
    ),
  ),
);

export const reducer = (state: State, action: Action) =>
  playerReducer(state, action);
