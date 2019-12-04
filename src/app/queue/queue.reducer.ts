import { createReducer, on, Action } from '@ngrx/store';
import { queueLoaded, queueSlotsRefreshed, queueSlotUpdated, queueStateUpdated, readyUp, showReadyUpDialog,
    hideReadyUpDialog, leaveQueue, togglePreReady, preReadyTimeoutReset, preReadyTimeoutCountDown, stopPreReady,
    mapVoteResultsUpdated, mapVoted, mapVoteReset, queueSlotsUpdated } from './queue.actions';
import { QueueSlot } from './models/queue-slot';
import { Queue } from './models/queue';
import { profileLoaded } from '@app/profile/profile.actions';

export interface State extends Queue {
  readyUpDialogShown: boolean;
  mapVote?: string;
  preReady: boolean;
  preReadyTimeout: number;
}

export const initialState: State = {
  config: null,
  slots: [],
  state: 'waiting',
  mapVoteResults: [],
  readyUpDialogShown: false,
  preReady: false,
  preReadyTimeout: 180,
};

function updateQueueSlot(slot: QueueSlot, state: State): State {
  const slots = state.slots.map(s => s.id === slot.id ? slot : s);
  return { ...state, slots };
}

function updateQueueSlots(slotsToUpdate: QueueSlot[], state: State): State {
  const slots = [ ...state.slots ]
    .map(slot => {
      return slotsToUpdate.find(s => s.id === slot.id) || slot;
    });
  return { ...state, slots };
}

const queueReducer = createReducer(
  initialState,
  on(queueLoaded, (state, { queue }) => ({ ...state, ...queue })),
  on(profileLoaded, (state, { profile }) => ({ ...state, mapVote: profile.mapVote })),
  on(queueSlotsRefreshed, (state, { slots }) => ({ ...state, slots })),
  on(queueSlotUpdated, (state, { slot }) => updateQueueSlot(slot, state)),
  on(queueSlotsUpdated, (state, { slots }) =>  updateQueueSlots(slots, state)),
  on(queueStateUpdated, (state, { queueState }) => ({ ...state, state: queueState })),
  on(mapVoteResultsUpdated, (state, { results }) => ({ ...state, mapVoteResults: results })),
  on(readyUp, state => ({ ...state, readyUpDialogShown: false })),
  on(showReadyUpDialog, state => ({ ...state, readyUpDialogShown: true })),
  on(hideReadyUpDialog, state => ({ ...state, readyUpDialogShown: false })),
  on(leaveQueue, state => ({ ...state, readyUpDialogShown: false, mapVote: undefined })),
  on(togglePreReady, state => ({ ...state, preReady: !state.preReady })),
  on(stopPreReady, state => ({ ...state, preReady: false })),
  on(preReadyTimeoutReset, state => ({ ...state, preReadyTimeout: 180 })),
  on(preReadyTimeoutCountDown, state => ({ ...state, preReadyTimeout: state.preReadyTimeout - 1 })),
  on(mapVoted, (state, { map }) => ({ ...state, mapVote: map })),
  on(mapVoteReset, state => ({ ...state, mapVote: undefined })),
);

export function reducer(state: State | undefined, action: Action) {
  return queueReducer(state, action);
}
