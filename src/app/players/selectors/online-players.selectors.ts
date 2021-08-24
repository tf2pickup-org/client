import { createSelector } from '@ngrx/store';
import { playersFeature } from './players-feature.selector';
import { onlinePlayersAdapter } from '../adapters';

const state = createSelector(playersFeature, feature => feature.onlinePlayers);

const { selectAll, selectTotal } = onlinePlayersAdapter.getSelectors();

export const onlinePlayers = createSelector(state, selectAll);
export const onlinePlayerCount = createSelector(state, selectTotal);
export const onlinePlayersLoaded = createSelector(state, state => state.loaded);
