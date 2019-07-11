import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState } from '../app.state';
import { State } from './queue.reducer';

const queueFeature = createFeatureSelector<AppState, State>('queue');

export const queue = createSelector(queueFeature, feature => feature.queue);
export const queueConfig = createSelector(queue, q => q && q.config);
export const queueClasses = createSelector(queueConfig, qc => qc && qc.classes);

export const queueRequiredPlayerCount = createSelector(
  queueClasses,
  qc => qc && qc.reduce((prev, curr) => prev + curr.count, 0) * 2
);

export const queuePlayers = createSelector(queue, q => q && q.players);
export const queueCurrentPlayerCount = createSelector(queuePlayers, players => players && players.length);

export const queueSlotPlayers = (slot: string) => createSelector(queuePlayers, players => players.filter(p => p.slot === slot));
