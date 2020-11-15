import { createReducer, on, Action } from '@ngrx/store';
import { queueLoaded, queueStateUpdated, readyUp, showReadyUpDialog, hideReadyUpDialog, leaveQueue, togglePreReady,
  stopPreReady, mapVoteResultsUpdated, mapVoted, mapVoteReset, queueSlotsUpdated, startPreReady, substituteRequestsUpdated,
  friendshipsUpdated } from './queue.actions';
import { QueueSlot } from './models/queue-slot';
import { Queue } from './models/queue';
import { profileLoaded } from '@app/profile/profile.actions';

export interface State extends Queue {
  readyUpDialogShown: boolean;
  mapVote?: string;
  preReady: boolean;
}

export const initialState: State = {
  config: null,
  slots: [],
  state: 'waiting',
  mapVoteResults: [],
  readyUpDialogShown: false,
  preReady: false,
  friendships: [],
};

const updateQueueSlots = (slotsToUpdate: QueueSlot[], state: State): State => {
  const slots = [ ...state.slots ]
    .map(slot => slotsToUpdate.find(s => s.id === slot.id) || { ...slot });
  return { ...state, slots };
};

const queueReducer = createReducer(
  initialState,
  on(queueLoaded, (state, { queue }) => ({ ...state, ...queue })),
  on(profileLoaded, (state, { profile }) => ({ ...state, mapVote: profile.mapVote })),
  on(queueSlotsUpdated, (state, { slots }) =>  updateQueueSlots(slots, state)),
  on(queueStateUpdated, (state, { queueState }) => ({ ...state, state: queueState })),
  on(mapVoteResultsUpdated, (state, { results }) => ({ ...state, mapVoteResults: results })),
  on(readyUp, state => ({ ...state, readyUpDialogShown: false })),
  on(showReadyUpDialog, state => ({ ...state, readyUpDialogShown: true })),
  on(hideReadyUpDialog, state => ({ ...state, readyUpDialogShown: false })),
  on(leaveQueue, state => ({ ...state, readyUpDialogShown: false })),
  on(togglePreReady, state => ({ ...state, preReady: !state.preReady })),
  on(startPreReady, state => ({ ...state, preReady: true })),
  on(stopPreReady, state => ({ ...state, preReady: false })),
  on(mapVoted, (state, { map }) => ({ ...state, mapVote: map })),
  on(mapVoteReset, state => ({ ...state, mapVote: undefined })),
  on(substituteRequestsUpdated, (state, { substituteRequests }) => ({ ...state, substituteRequests })),
  on(friendshipsUpdated, (state, { friendships }) => ({ ...state, friendships })),
);

export const reducer = (state: State | undefined, action: Action) => queueReducer(state, action);
