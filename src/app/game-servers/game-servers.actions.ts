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

export const failedToAddGameServer = createAction(
  '[API] Failed to add game server',
  props<{ error: string }>(),
);

export const removeGameServer = createAction(
  '[Admin] Remove game server',
  props<{ gameServerId: string }>(),
);

export const gameServerRemoved = createAction(
  '[API] Game server removed',
  props<{ gameServerId: string }>(),
);

export const loadGameServer = createAction(
  '[Game servers] Load one game server',
  props<{ gameServerId: string }>(),
);

export const gameServerLoaded = createAction(
  '[API] One game server loaded',
  props<{ gameServer: GameServer }>(),
);
