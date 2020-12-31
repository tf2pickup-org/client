import { createSelector } from '@ngrx/store';
import { playerSkillsAdapter } from '../adapters';
import { playersFeature } from './players-feature.selector';

const skills = createSelector(playersFeature, feature => feature.skills);

// eslint-disable-next-line no-shadow
export const playerSkillsLocked = createSelector(skills, skills => skills.locked);

const { selectEntities } = playerSkillsAdapter.getSelectors();
const skillsEntities = createSelector(skills, selectEntities);

// eslint-disable-next-line no-shadow
export const playerSkill = (playerId: string) => createSelector(skillsEntities, skills => skills[playerId]?.skill);
