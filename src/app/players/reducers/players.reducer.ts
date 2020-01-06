import { EntityState } from '@ngrx/entity';
import { Player } from '../models/player';
import { playersAdapter as adapter } from '../adapters';
import { createReducer, Action, on } from '@ngrx/store';
import { playerLoaded, playerUpdated, playerEdited, playerSkillLoaded, playersLoaded, allPlayerSkillsLoaded, setPlayerName,
  setPlayerRole, setPlayerSkill, playerSkillEdited } from '../actions';
import { PlayerSkill } from '../models/player-skill';

export interface State extends EntityState<Player> {
  locked: boolean; // is player editing enabled or not
}

const initialState: State = adapter.getInitialState({
  locked: false,
});

function updatePlayerSkill(playerId: string, skill: { [gameClass: string]: number }, state: State): State {
  return adapter.updateOne({
    id: playerId,
    changes: { skill },
  }, state);
}

function insertAllPlayerSkills(playerSkills: PlayerSkill[], state: State): State {
  return adapter.updateMany(playerSkills.map(skill => ({
    id: skill.player,
    changes: {
      skill: skill.skill,
    },
  })), state);
}

const playerReducer = createReducer(
  initialState,
  on(playerLoaded, (state, { player }) => adapter.upsertOne(player, state)),
  on(playerUpdated, (state, { player }) => adapter.upsertOne(player, state)),

  on(setPlayerName, state => ({ ...state, locked: true })),
  on(setPlayerRole, state => ({ ...state, locked: true })),
  on(playerEdited, (state, { player }) => ({ ...adapter.upsertOne(player, state), locked: false })),

  on(playerSkillLoaded, (state, { playerId, skill }) => updatePlayerSkill(playerId, skill, state)),
  on(setPlayerSkill, state => ({ ...state, locked: true })),
  on(playerSkillEdited, (state, { playerId, skill }) => ({ ...updatePlayerSkill(playerId, skill, state), locked: false })),

  on(allPlayerSkillsLoaded, (state, { playerSkills }) => insertAllPlayerSkills(playerSkills, state)),

  on(playersLoaded, (state, { players }) => adapter.upsertMany(players, state)),
);

export function reducer(state: State | undefined, action: Action) {
  return playerReducer(state, action);
}
