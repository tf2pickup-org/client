import { EntityState } from '@ngrx/entity';
import { Game } from './models/game';
import { adapter } from './games.adapter';
import { createReducer, Action, on } from '@ngrx/store';
import { gameAdded, gameUpdated } from './games.actions';

export interface State extends EntityState<Game> { }

const initialState: State = adapter.getInitialState();

const gameReducer = createReducer(
  initialState,
  on(gameAdded, (state, { game }) => adapter.upsertOne(game, state)),
  on(gameUpdated, (state, { game }) => adapter.upsertOne(game, state)),
);

export function reducer(state: State | undefined, action: Action) {
  return gameReducer(state, action);
}
