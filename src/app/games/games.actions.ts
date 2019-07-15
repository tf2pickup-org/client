import { createAction, props } from '@ngrx/store';
import { Game } from './models/game';

export const loadGames = createAction('[Games] Load games');

export const gamesLoaded = createAction(
  '[API] Games loaded',
  props<{ games: Game[] }>(),
);

export const gameAdded = createAction(
  '[WS/API] Game added',
  props<{ game: Game }>(),
);

export const loadGame = createAction(
  '[Games] Load game',
  props<{ gameId: string }>(),
);
