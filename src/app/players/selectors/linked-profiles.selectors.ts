import { createSelector } from '@ngrx/store';
import { playersFeature } from './players-feature.selector';
import { linkedProfilesAdapter } from '../adapters';

const linkedProfiles = createSelector(
  playersFeature,
  feature => feature.linkedProfiles,
);

const { selectEntities } = linkedProfilesAdapter.getSelectors();
const linkedProfilesEntities = createSelector(linkedProfiles, selectEntities);

export const linkedProfilesByPlayerId = (playerId: string) =>
  createSelector(linkedProfilesEntities, entities => entities[playerId]);
