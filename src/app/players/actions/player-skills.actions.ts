import { createAction, props } from '@ngrx/store';
import { PlayerSkill } from '../models/player-skill';

export const loadPlayerSkill = createAction(
  '[Player edit] Load player skill',
  props<{ playerId: string }>(),
);

export const playerSkillLoaded = createAction(
  '[API] Player skill loaded',
  props<{ skill: PlayerSkill }>(),
);

export const setPlayerSkill = createAction(
  '[Player] Set player skill',
  props<{ skill: PlayerSkill }>(),
);

export const playerSkillEdited = createAction(
  '[API] Player skill edited successfully',
  props<{ skill: PlayerSkill }>(),
);

export const failedToLoadPlayerSkill = createAction(
  '[API] Failed to load player skill',
  props<{ error: any }>(),
);

export const initializeDefaultPlayerSkill = createAction(
  '[API] Initialize player skill with default values',
  props<{ playerId: string }>(),
);

export const loadAllPlayerSkills = createAction('[Player skill table] Load all player skills');

export const allPlayerSkillsLoaded = createAction(
  '[API] All player skills loaded',
  props<{ playerSkills: PlayerSkill[] }>(),
);
