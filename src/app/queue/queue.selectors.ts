import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState } from '../app.state';
import { State } from './queue.reducer';
import { profile } from '@app/profile/profile.selectors';

const queueFeature = createFeatureSelector<AppState, State>('queue');

export const queueConfig = createSelector(queueFeature, feature => feature.config);
export const queueClasses = createSelector(queueConfig, qc => qc && qc.classes);
export const queueState = createSelector(queueFeature, feature => feature.state);
export const queueLocked = createSelector(queueFeature, feature => feature.locked);

export const queueRequiredPlayerCount = createSelector(
  queueClasses,
  queueConfig,
  (classes, config) => classes && classes.reduce((prev, curr) => prev + curr.count, 0) * config.teamCount
);

export const queueSlots = createSelector(queueFeature, feature => feature.slots);
export const queueCurrentPlayerCount = createSelector(
  queueSlots,
  slots => slots && slots.reduce((prev, curr) => curr.playerId ? prev + 1 : prev, 0)
);

export const queueSlotsForClass = (gameClass: string) => createSelector(
  queueSlots,
  slots => slots && slots.filter(s => s.gameClass === gameClass)
);

export const mySlot = createSelector(
  profile,
  queueSlots,
  (theProfile, slots) => theProfile && slots.find(s => s.playerId === theProfile.id)
);

export const isInQueue = createSelector(mySlot, theSlot => !!theSlot);
export const queueMap = createSelector(queueFeature, feature => feature.map);
export const queueShowReadyUpDialog = createSelector(queueFeature, feature => feature.readyUpDialogShown);
export const votesForMapChange = createSelector(queueFeature, feature => feature.votesForMapChange);

export const mapChangeVoterCount = createSelector(
  queueSlots,
  slots => slots && slots.reduce((prev, curr) => curr.votesForMapChange ? prev + 1 : prev, 0)
);
