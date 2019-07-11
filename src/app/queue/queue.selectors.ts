import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState } from '../app.state';
import { State } from './queue.reducer';

const queueFeature = createFeatureSelector<AppState, State>('queue');

export const queue = createSelector(queueFeature, feature => feature.queue);
export const queueConfig = createSelector(queue, q => q.config);
export const queueClasses = createSelector(queueConfig, qc => qc.classes);

export const queueRequiredPlayerCount = createSelector(
  queueClasses,
  qc => qc.reduce((prev, curr) => prev + curr.count, 0)
);

export const queueCurrentPlayerCount = createSelector(queue, q => q.players.length);
