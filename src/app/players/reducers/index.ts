import { State as PlayersState, reducer as playersReducer } from './players.reducer';
import { State as PlayerBansState, reducer as playerBansReducer } from './player-bans.reducer';
import { ActionReducerMap } from '@ngrx/store';

export interface State {
  players: PlayersState;
  bans: PlayerBansState;
}

export const reducer: ActionReducerMap<State> = {
  players: playersReducer,
  bans: playerBansReducer,
};
