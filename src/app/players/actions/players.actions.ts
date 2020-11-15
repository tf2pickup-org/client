import { createAction, props } from '@ngrx/store';
import { Player } from '../models/player';
import { PlayerSkill } from '../models/player-skill';
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

export const setPlayerSkill = createAction(
  '[Player] Set player skill',
  props<{ playerId: string; skill: { [gameClass: string]: number } }>(),
);

export const playerSkillEdited = createAction(
  '[API] Player skill edited successfully',
  props<{ playerId: string; skill: { [gameClass: string]: number } }>(),
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
  props<{ playerId: string; skill: { [gameClass: string]: number } }>(),
);

export const initializeDefaultPlayerSkill = createAction(
  '[API] Initialize player skill with default values',
  props<{ playerId: string }>(),
);

export const failedToLoadPlayerSkill = createAction(
  '[API] Failed to load player skill',
  props<{ error: any }>(),
);

export const loadPlayers = createAction('[Player list] Load all players');

export const playersLoaded = createAction(
  '[API] All players loaded',
  props<{ players: Player[] }>(),
);

export const loadAllPlayerSkills = createAction('[Player skill table] Load all player skills');

export const allPlayerSkillsLoaded = createAction(
  '[API] All player skills loaded',
  props<{ playerSkills: PlayerSkill[] }>(),
);
