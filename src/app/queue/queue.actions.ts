import { createAction, props } from '@ngrx/store';
import { Queue } from './models/queue';
import { QueueSlot } from './models/queue-slot';
import { QueueState } from './models/queue-state';
import { MapVoteResult } from './models/map-vote-result';
import { SubstituteRequest } from './models/substitute-request';
import { Friendship } from './models/friendship';

export const loadQueue = createAction('[Init] Load queue');

export const queueLoaded = createAction(
  '[API] Queue loaded',
  props<{ queue: Queue }>(),
);

export const joinQueue = createAction(
  '[Queue] Join queue',
  props<{ slotId: number }>(),
);

export const joinQueueError = createAction(
  '[API] Failed to join queue',
  props<{ error: string }>(),
);

export const leaveQueue = createAction('[Queue] Leave queue');

export const leaveQueueError = createAction(
  '[API] Failed to leave the queue',
  props<{ error: string }>(),
);

export const queueSlotsUpdated = createAction(
  '[WS] Queue slots updated',
  props<{ slots: QueueSlot[] }>(),
);

export const queueStateUpdated = createAction(
  '[WS] Queue state updated',
  props<{ queueState: QueueState }>(),
);

export const readyUp = createAction('[Queue] Confirm ready to play');

export const readyUpError = createAction(
  '[API] Failed to ready up',
  props<{ error: string }>(),
);

export const mapVoteResultsUpdated = createAction(
  '[WS] Map vote results update',
  props<{ results: MapVoteResult[] }>(),
);

export const voteForMap = createAction(
  '[Queue] Vote for map',
  props<{ map: string }>(),
);

export const mapVoted = createAction(
  '[WS] Voted for map',
  props<{ map: string }>(),
);

export const mapVoteReset = createAction('[Queue] Map vote reset');

export const togglePreReady = createAction('[Queue] Toggle pre-ready up');
export const startPreReady = createAction('[Queue] Start pre-ready');
export const stopPreReady = createAction('[Queue] Stop pre-ready');

export const markFriend = createAction(
  '[Queue] Mark friend',
  props<{ friendId: string }>(),
);

export const substituteRequestsUpdated = createAction(
  '[WS] Substitute requests updated',
  props<{ substituteRequests: SubstituteRequest[] }>(),
);

export const friendshipsUpdated = createAction(
  '[API] Friendships updated',
  props<{ friendships: Friendship[] }>(),
);
