import { createReducer, on, Action } from '@ngrx/store';
import { queueLoaded, queueSlotsRefreshed, queueSlotUpdated, queueStateUpdated, queueLocked, queueUnlocked,
  queueMapUpdated, readyUp, showReadyUpDialog, hideReadyUpDialog, leaveQueue} from './queue.actions';
import { QueueSlot } from './models/queue-slot';
import { profileLoaded } from '@app/profile/profile.actions';
import { Queue } from './models/queue';

export interface State extends Queue {
  locked: boolean; // is the queue locked for the current user
  readyUpDialogShown: boolean;
}

export const initialState: State = {
  config: null,
  slots: [],
  state: 'waiting',
  map: '',
  locked: true,
  readyUpDialogShown: false,
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
  on(profileLoaded, (state, { profile }) => ({ ...state, locked: profile ? !!profile.activeGameId : true })),
  on(queueLocked, state => ({ ...state, locked: true })),
  on(queueUnlocked, state => ({ ...state, locked: false })),
  on(queueMapUpdated, (state, { map }) => ({ ...state, map })),
  on(readyUp, state => ({ ...state, readyUpDialogShown: false })),
  on(showReadyUpDialog, state => ({ ...state, readyUpDialogShown: true })),
  on(hideReadyUpDialog, state => ({ ...state, readyUpDialogShown: false })),
  on(leaveQueue, state => ({ ...state, readyUpDialogShown: false })),
);

export function reducer(state: State | undefined, action: Action) {
  return queueReducer(state, action);
}
