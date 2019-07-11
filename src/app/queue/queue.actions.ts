import { createAction, props } from '@ngrx/store';
import { Queue } from './models/queue';

export const queueLoaded = createAction(
  '[API] Queue loaded',
  props<{ queue: Queue }>(),
);
