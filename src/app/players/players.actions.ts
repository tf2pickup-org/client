import { createAction, props } from '@ngrx/store';
import { Player } from './models/player';
import { PlayerSkill } from './models/player-skill';

export const loadPlayer = createAction(
  '[Queue] Load player',
  props<{ playerId: string }>(),
);

export const playerLoaded = createAction(
  '[API] Player loaded',
  props<{ player: Player }>(),
);

export const editPlayer = createAction(
  '[Player] Edit player',
  props<{ player: Player }>(),
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

export const loadPlayerSkill = createAction(
  '[Player edit] Load player skill',
  props<{ playerId: string }>(),
);

export const playerSkillLoaded = createAction(
  '[API] Player skill loaded',
  props<{ playerSkill: PlayerSkill }>(),
);

export const loadPlayers = createAction('[Player list] Load all players');

export const playersLoaded = createAction(
  '[API] All players loaded',
  props<{ players: Player[] }>(),
);
