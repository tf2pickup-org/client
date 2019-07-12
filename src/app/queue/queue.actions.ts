import { createAction, props } from '@ngrx/store';
import { Queue } from './models/queue';
import { QueuePlayer } from './models/queue-player';

export const loadQueue = createAction('[Init] Load queue');

export const queueLoaded = createAction(
  '[API] Queue loaded',
  props<{ queue: Queue }>(),
);

export const joinQueue = createAction(
  '[Queue] Join queue',
  props<{ slot: string }>(),
);

export const queuePlayersRefreshed = createAction(
  '[API] Queue players refreshed',
  props<{ players: QueuePlayer[] }>(),
);

export const leaveQueue = createAction('[Queue] Leave queue');
