import { createAction, props } from '@ngrx/store';
import { Queue } from './models/queue';
import { QueueSlot } from './models/queue-slot';
import { QueueState } from './models/queue-state';
import { MapVoteResult } from './models/map-vote-result';

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

export const queueSlotsRefreshed = createAction(
  '[API] Queue slots refreshed',
  props<{ slots: QueueSlot[] }>(),
);

export const leaveQueue = createAction('[Queue] Leave queue');

export const leaveQueueError = createAction(
  '[API] Failed to leave queue',
  props<{ error: string }>(),
);

export const queueSlotUpdated = createAction(
  '[WS] Queue slot updated',
  props<{ slot: QueueSlot }>(),
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

export const showReadyUpDialog = createAction('[Queue] Show ready up dialog');
export const hideReadyUpDialog = createAction('[Queue] Hide ready up dialog');

export const togglePreReady = createAction('[Queue] Toggle pre-ready up');
export const stopPreReady = createAction('[Queue] Stop pre-ready');
export const preReadyTimeoutReset = createAction('[Queue] Pre-ready timer reset');
export const preReadyTimeoutCountDown = createAction('[Queue] Pre-ready timeout count down');

export const markFriend = createAction(
  '[Queue] Mark friend',
  props<{ friendId: string }>(),
);
