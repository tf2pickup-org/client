import { State as QueueState } from './queue/queue.reducer';

export interface AppState {
  queue: QueueState;
}
