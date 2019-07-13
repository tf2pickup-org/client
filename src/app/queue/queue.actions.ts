import { createAction, props } from '@ngrx/store';
import { Queue } from './models/queue';
import { QueueSlot } from './models/queue-slot';

export const loadQueue = createAction('[Init] Load queue');

export const queueLoaded = createAction(
  '[API] Queue loaded',
  props<{ queue: Queue }>(),
);

export const joinQueue = createAction(
  '[Queue] Join queue',
  props<{ slotId: number }>(),
);

export const queueSlotsRefreshed = createAction(
  '[API] Queue slots refreshed',
  props<{ slots: QueueSlot[] }>(),
);

export const leaveQueue = createAction('[Queue] Leave queue');

export const queueSlotUpdated = createAction(
  '[WS] Queue slot updated',
  props<{ slot: QueueSlot }>(),
);
