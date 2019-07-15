import { EntityState } from '@ngrx/entity';
import { Game } from './models/game';
import { adapter } from './games.adapter';
import { createReducer, Action, on } from '@ngrx/store';
import { gamesLoaded, gameAdded } from './games.actions';

export interface State extends EntityState<Game> {
  loaded: boolean;
}

const initialState: State = adapter.getInitialState({
  loaded: false,
});

const gameReducer = createReducer(
  initialState,
  on(gamesLoaded, (state, { games }) => ({ ...adapter.addAll(games, state), loaded: true })),
  on(gameAdded, (state, { game }) => adapter.upsertOne(game, state)),
);

export function reducer(state: State | undefined, action: Action) {
  return gameReducer(state, action);
}
