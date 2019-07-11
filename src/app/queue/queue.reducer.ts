import { Queue } from './models/queue';
import { createReducer, on, Action } from '@ngrx/store';
import { queueLoaded } from './queue.actions';

export interface State {
  queue: Queue;
}

export const initialState: State = {
  queue: {
    config: {
      classes: [
        { name: 'scout', count: 2 },
        { name: 'soldier', count: 2 },
        { name: 'demoman', count: 1 },
        { name: 'medic', count: 1 }
      ],
    },
    players: [],
  },
};

const queueReducer = createReducer(
  initialState,
  on(queueLoaded, (state, { queue }) => ({ ...state, queue })),
);

export function reducer(state: State | undefined, action: Action) {
  return queueReducer(state, action);
}
