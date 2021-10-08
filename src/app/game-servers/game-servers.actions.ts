import { createAction, props } from '@ngrx/store';
import { GameServer } from './models/game-server';

export const loadGameServers = createAction('[Game servers] Load game servers');

export const gameServersLoaded = createAction(
  '[API] Game servers loaded',
  props<{ gameServers: GameServer[] }>(),
);

export const loadGameServer = createAction(
  '[Game servers] Load one game server',
  props<{ gameServerId: string }>(),
);

export const gameServerLoaded = createAction(
  '[API] One game server loaded',
  props<{ gameServer: GameServer }>(),
);
