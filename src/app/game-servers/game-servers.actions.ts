import { createAction, props } from '@ngrx/store';
import { GameServer } from './models/game-server';

export const loadGameServers = createAction('[Game servers] Load game servers');

export const gameServersLoaded = createAction(
  '[API] Game servers loaded',
  props<{ gameServers: GameServer[] }>(),
);

export const addGameServer = createAction(
  '[Admin] Add game server',
  props<{ gameServer: GameServer }>(),
);

export const gameServerAdded = createAction(
  '[API] Game server added',
  props<{ gameServer: GameServer }>(),
);
