import { Queue } from './models/queue';
import { createReducer, on, Action } from '@ngrx/store';
import { queueLoaded, queueSlotsRefreshed, queueSlotUpdated } from './queue.actions';
import { QueueSlot } from './models/queue-slot';
import { QueueConfig } from './models/queue-config';

export interface State {
  config: QueueConfig;
  slots: QueueSlot[];
}

export const initialState: State = {
  config: null,
  slots: [],
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
);

export function reducer(state: State | undefined, action: Action) {
  return queueReducer(state, action);
}
