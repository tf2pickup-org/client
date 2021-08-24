import {
  State as PlayersState,
  reducer as playersReducer,
} from './players.reducer';
import {
  State as PlayerBansState,
  reducer as playerBansReducer,
} from './player-bans.reducer';
import {
  State as LinkedProfilesState,
  reducer as linkedProfilesReducer,
} from './linked-profiles.reducer';
import {
  State as OnlinePlayersState,
  reducer as onlinePlayersReducer,
} from './online-players.reducer';
import { ActionReducerMap } from '@ngrx/store';

export interface State {
  players: PlayersState;
  bans: PlayerBansState;
  linkedProfiles: LinkedProfilesState;
  onlinePlayers: OnlinePlayersState;
}

export const reducer: ActionReducerMap<State> = {
  players: playersReducer,
  bans: playerBansReducer,
  linkedProfiles: linkedProfilesReducer,
  onlinePlayers: onlinePlayersReducer,
};
