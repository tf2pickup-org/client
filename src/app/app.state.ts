import { State as QueueState } from './queue/queue.reducer';
import { State as PlayerState } from './player/player.reducer';

export interface AppState {
  queue: QueueState;
  players: PlayerState;
}
