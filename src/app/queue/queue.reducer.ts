import { createReducer, on, Action } from '@ngrx/store';
import { queueLoaded, queueSlotsRefreshed, queueSlotUpdated, queueStateUpdated, queueMapUpdated, readyUp,
    showReadyUpDialog, hideReadyUpDialog, leaveQueue, toggleVoteForMapChange, togglePreReady, preReadyTimeoutReset,
    preReadyTimeoutCountDown, stopPreReady } from './queue.actions';
import { QueueSlot } from './models/queue-slot';
import { Queue } from './models/queue';

export interface State extends Queue {
  readyUpDialogShown: boolean;
  votesForMapChange: boolean;
  preReady: boolean;
  preReadyTimeout: number;
}

export const initialState: State = {
  config: null,
  slots: [],
  state: 'waiting',
  map: '',
  readyUpDialogShown: false,
  votesForMapChange: false,
  preReady: false,
  preReadyTimeout: 180,
};

function updateQueueSlot(slot: QueueSlot, state: State) {
  const slots = state.slots.map(s => s.id === slot.id ? slot : s);
  return { ...state, slots };
}

const queueReducer = createReducer(
  initialState,
  on(queueLoaded, (state, { queue }) => ({ ...state, ...queue })),
  on(queueSlotsRefreshed, (state, { slots }) => ({ ...state, slots })),
  on(queueSlotUpdated, (state, { slot }) => updateQueueSlot(slot, state)),
  on(queueStateUpdated, (state, { queueState }) => ({ ...state, state: queueState })),
  on(queueMapUpdated, (state, { map }) => ({ ...state, map, votesForMapChange: false })),
  on(readyUp, state => ({ ...state, readyUpDialogShown: false })),
  on(showReadyUpDialog, state => ({ ...state, readyUpDialogShown: true })),
  on(hideReadyUpDialog, state => ({ ...state, readyUpDialogShown: false })),
  on(leaveQueue, state => ({ ...state, readyUpDialogShown: false, votesForMapChange: false })),
  on(toggleVoteForMapChange, state => ({ ...state, votesForMapChange: !state.votesForMapChange })),
  on(togglePreReady, state => ({ ...state, preReady: !state.preReady })),
  on(stopPreReady, state => ({ ...state, preReady: false })),
  on(preReadyTimeoutReset, state => ({ ...state, preReadyTimeout: 180 })),
  on(preReadyTimeoutCountDown, state => ({ ...state, preReadyTimeout: state.preReadyTimeout - 1 })),
);

export function reducer(state: State | undefined, action: Action) {
  return queueReducer(state, action);
}
