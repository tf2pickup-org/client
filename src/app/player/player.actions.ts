import { createAction, props } from '@ngrx/store';
import { Player } from './models/player';

export const loadPlayer = createAction(
  '[Queue] Load player',
  props<{ playerId: string }>(),
);

export const playerLoaded = createAction(
  '[API] Player loaded',
  props<{ player: Player }>(),
);
