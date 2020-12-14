import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState } from '../app.state';
import { State } from './queue.reducer';
import { profile } from '@app/profile/profile.selectors';

const queueFeature = createFeatureSelector<AppState, State>('queue');

export const queueConfig = createSelector(queueFeature, feature => feature.config);
export const queueClasses = createSelector(queueConfig, config => config?.classes);
export const queueState = createSelector(queueFeature, feature => feature.state);

export const queueRequiredPlayerCount = createSelector(
  queueClasses,
  queueConfig,
  (classes, config) => classes?.reduce((prev, curr) => prev + curr.count, 0) * config.teamCount
);

export const queueSlots = createSelector(queueFeature, feature => feature.slots);
export const queueCurrentPlayerCount = createSelector(
  queueSlots,
  slots => slots?.reduce((prev, curr) => curr.playerId ? prev + 1 : prev, 0)
);

export const queueSlotsForClass = (gameClass: string) => createSelector(
  queueSlots,
  slots => slots?.filter(s => s.gameClass === gameClass)
);

export const slotById = (slotId: number) => createSelector(
  queueSlots,
  slots => slots.find(s => s.id === slotId)
);

export const mySlot = createSelector(
  profile,
  queueSlots,
  (theProfile, slots) => theProfile && slots.find(s => s.playerId === theProfile.id)
);

export const isInQueue = createSelector(mySlot, theSlot => !!theSlot);
export const mapVoteResults = createSelector(queueFeature, feature => feature.mapVoteResults);
export const mapVoteTotalCount = createSelector(
  mapVoteResults,
  results => results.reduce((a, b) => a + b.voteCount, 0)
);

export const mapVote = createSelector(queueFeature, feature => feature.mapVote);
export const isPreReadied = createSelector(queueFeature, feature => feature.preReady);

export const substituteRequests = createSelector(queueFeature, feature => feature.substituteRequests);

export const queueFriendships = createSelector(queueFeature, feature => feature.friendships);
