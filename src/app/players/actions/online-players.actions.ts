import { createAction, props } from '@ngrx/store';
import { Player } from '../models/player';

export const loadOnlinePlayers = createAction(
  '[Online player list] Load online players',
);

export const onlinePlayersLoaded = createAction(
  '[API] Online players loaded',
  props<{ players: Player[] }>(),
);

export const playerConnected = createAction(
  '[WS] Player connected',
  props<{ player: Player }>(),
);

export const playerDisconnected = createAction(
  '[WS] Player disconnected',
  props<{ player: Player }>(),
);
