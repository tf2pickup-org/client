import { State as QueueState } from './queue/queue.reducer';
import { State as PlayerState } from './player/player.reducer';
import { State as ProfileState } from './profile/profile.reducer';

export interface AppState {
  queue: QueueState;
  players: PlayerState;
  profile: ProfileState;
}
