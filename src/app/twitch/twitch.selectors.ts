import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState } from '@app/app.state';
import { State } from './twitch.reducer';

const twitchFeature = createFeatureSelector<AppState, State>('twitch');

export const twitchStreams = createSelector(
  twitchFeature,
  feature => feature.streams,
);
