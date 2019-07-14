import { createAction, props } from '@ngrx/store';
import { Game } from './models/game';

export const loadGames = createAction('[Games] Load games');

export const gamesLoaded = createAction(
  '[API] Games loaded',
  props<{ games: Game[] }>(),
);
