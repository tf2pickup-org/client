import { EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { allPlayerSkillsLoaded, playerSkillEdited, playerSkillLoaded, setPlayerSkill } from '../actions';
import { adapter } from '../adapters/player-skills.adapter';
import { PlayerSkill } from '../models/player-skill';

export interface State extends EntityState<PlayerSkill> {
  locked: boolean;
}

const initialState: State = adapter.getInitialState({
  locked: false,
});

const playerSkillsReducer = createReducer(
  initialState,
  on(playerSkillLoaded, (state, { skill }) => adapter.upsertOne(skill, state)),
  on(setPlayerSkill, state => ({ ...state, locked: true })),
  on(playerSkillEdited, (state, { skill }) => ({ ...adapter.updateOne(({ id: skill.player, changes: skill }), state), locked: false })),
  on(allPlayerSkillsLoaded, (state, { playerSkills }) => adapter.upsertMany(playerSkills, state)),
);

export const reducer = (state: State, action: Action) => playerSkillsReducer(state, action);
