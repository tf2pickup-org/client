import { createAction, props } from '@ngrx/store';
import { Player } from '../models/player';
import { PlayerRole } from '../models/player-role';

export const loadPlayer = createAction(
  '[Queue] Load player',
  props<{ playerId: string }>(),
);

export const playerLoaded = createAction(
  '[API] Player loaded',
  props<{ player: Player }>(),
);

export const setPlayerName = createAction(
  '[Player] Set player name',
  props<{ playerId: string; name: string }>(),
);

export const setPlayerRole = createAction(
  '[Player] Set player role',
  props<{ playerId: string; role: PlayerRole }>(),
);

export const playerEdited = createAction(
  '[API] Player edited successfully',
  props<{ player: Player }>(),
);

// fixme: this will be used when player synchronization is implemented
export const playerUpdated = createAction(
  '[WS] Player updated',
  props<{ player: Player }>(),
);

export const loadPlayers = createAction('[Player list] Load all players');

export const playersLoaded = createAction(
  '[API] All players loaded',
  props<{ players: Player[] }>(),
);
