import { Queue } from './models/queue';
import { createReducer, on, Action } from '@ngrx/store';
import { queueLoaded, queuePlayersRefreshed } from './queue.actions';
import { QueuePlayer } from './models/queue-player';

export interface State {
  queue: Queue;
}

export const initialState: State = {
  queue: null,
};

function replacePlayers(players: QueuePlayer[], state: State) {
  return {
    ...state,
    queue: {
      ...state.queue,
      players,
    }
  };
}

const queueReducer = createReducer(
  initialState,
  on(queueLoaded, (state, { queue }) => ({ ...state, queue })),
  on(queuePlayersRefreshed, (state, { players }) => replacePlayers(players, state)),
);

export function reducer(state: State | undefined, action: Action) {
  return queueReducer(state, action);
}
