import { State as PlayersState, reducer as playersReducer } from './players.reducer';
import { State as PlayerBansState, reducer as playerBansReducer } from './player-bans.reducer';
import { State as PlayerSkillsState, reducer as playerSkillsReducer } from './player-skills.reducer';
import { ActionReducerMap } from '@ngrx/store';

export interface State {
  players: PlayersState;
  bans: PlayerBansState;
  skills: PlayerSkillsState;
}

export const reducer: ActionReducerMap<State> = {
  players: playersReducer,
  bans: playerBansReducer,
  skills: playerSkillsReducer,
};
