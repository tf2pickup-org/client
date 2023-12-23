import { createReducer, on, Action } from '@ngrx/store';
import {
  queueLoaded,
  queueStateUpdated,
  togglePreReady,
  stopPreReady,
  mapVoteResultsUpdated,
  mapVoted,
  mapVoteReset,
  queueSlotsUpdated,
  startPreReady,
  substituteRequestsUpdated,
  friendshipsUpdated,
} from './queue.actions';
import { QueueSlot } from './models/queue-slot';
import { Queue } from './models/queue';
import { profileLoaded } from '@app/profile/profile.actions';
import { environment } from '@environment';
import { QueueConfig } from './models/queue-config';

export interface State extends Queue {
  mapVote?: string;
  preReady: boolean;
}

export const initialState: State = {
  config: environment.entryQueue.config as QueueConfig,
  slots: environment.entryQueue.slots,
  state: 'loading',
  mapVoteResults: [],
  preReady: false,
  friendships: [],
};

const updateQueueSlots = (slotsToUpdate: QueueSlot[], state: State): State => {
  const slots = [...state.slots].map(
    slot => slotsToUpdate.find(s => s.id === slot.id) || { ...slot },
  );
  return { ...state, slots };
};

const queueReducer = createReducer(
  initialState,
  on(queueLoaded, (state, { queue }) => ({
    ...state,
    ...queue,
    loading: false,
  })),
  on(profileLoaded, (state, { profile }) => ({
    ...state,
    mapVote: profile.mapVote,
  })),
  on(queueSlotsUpdated, (state, { slots }) => updateQueueSlots(slots, state)),
  on(queueStateUpdated, (state, { queueState }) => ({
    ...state,
    state: queueState,
  })),
  on(mapVoteResultsUpdated, (state, { results }) => ({
    ...state,
    mapVoteResults: results,
  })),

  on(togglePreReady, state => ({ ...state, preReady: !state.preReady })),
  on(startPreReady, state => ({ ...state, preReady: true })),
  on(stopPreReady, state => ({ ...state, preReady: false })),

  on(mapVoted, (state, { map }) => ({ ...state, mapVote: map })),
  on(mapVoteReset, state => ({ ...state, mapVote: undefined })),

  on(substituteRequestsUpdated, (state, { substituteRequests }) => ({
    ...state,
    substituteRequests,
  })),
  on(friendshipsUpdated, (state, { friendships }) => ({
    ...state,
    friendships,
  })),
);

export const reducer = (state: State | undefined, action: Action) =>
  queueReducer(state, action);
