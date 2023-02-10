import { createAction, props } from '@ngrx/store';
import { Game } from './models/game';

export const gameCreated = createAction(
  '[WS] Game created',
  props<{ game: Game }>(),
);

export const gameAdded = createAction(
  '[API] Game added',
  props<{ game: Game }>(),
);

export const ownGameAdded = createAction(
  '[Games] Own game started',
  props<{ gameId: string }>(),
);

export const loadGame = createAction(
  '[Games] Load game',
  props<{ gameId: string }>(),
);

export const gameUpdated = createAction(
  '[WS] Game updated',
  props<{ game: Game }>(),
);

export const forceEndGame = createAction(
  '[Admin] Force end game',
  props<{ gameId: string }>(),
);

export const reinitializeServer = createAction(
  '[Admin] Re-initialize server',
  props<{ gameId: string }>(),
);

export const requestSubstitute = createAction(
  '[Admin] Request substitute',
  props<{ gameId: string; playerId: string }>(),
);

export const cancelSubstitutionRequest = createAction(
  '[Admin] Cancel substitution request',
  props<{ gameId: string; playerId: string }>(),
);
