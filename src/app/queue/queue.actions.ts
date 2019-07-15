import { createAction, props } from '@ngrx/store';
import { Queue } from './models/queue';
import { QueueSlot } from './models/queue-slot';
import { QueueState } from './models/queue-state';

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

export const queueLocked = createAction('[Queue] Queue locked');
export const queueUnlocked = createAction('[Queue] Queue unlocked');
