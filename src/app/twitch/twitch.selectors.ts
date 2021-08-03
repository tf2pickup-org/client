import { createFeatureSelector, createSelector } from '@ngrx/store';
import { State } from './twitch.reducer';

const twitchFeature = createFeatureSelector<State>('twitch');

export const twitchStreams = createSelector(
  twitchFeature,
  feature => feature.streams,
);
