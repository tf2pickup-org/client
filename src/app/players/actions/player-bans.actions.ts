import { createAction, props } from '@ngrx/store';
import { PlayerBan } from '../models/player-ban';

export const loadPlayerBans = createAction(
  '[Player bans] Load player bans',
  props<{ playerId: string }>(),
);

export const playerBansLoaded = createAction(
  '[API] Player bans loaded',
  props<{ playerBans: PlayerBan[] }>(),
);

export const addPlayerBan = createAction(
  '[Player bans] Add player ban',
  props<{ playerBan: Partial<PlayerBan> }>(),
);

export const playerBanAdded = createAction(
  '[API] Player ban added',
  props<{ playerBan: PlayerBan }>(),
);

export const revokePlayerBan = createAction(
  '[Player bans] Revoke player ban',
  props<{ playerBan: PlayerBan }>(),
);

export const playerBanUpdated = createAction(
  '[API] Player ban updated',
  props<{ playerBan: PlayerBan }>(),
);
