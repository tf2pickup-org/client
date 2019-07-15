import { State as QueueState } from './queue/queue.reducer';
import { State as PlayersState } from './players/players.reducer';
import { State as ProfileState } from './profile/profile.reducer';
import { State as GamesState } from './games/games.reducer';

export interface AppState {
  queue: QueueState;
  players: PlayersState;
  profile: ProfileState;
  games: GamesState;
}
