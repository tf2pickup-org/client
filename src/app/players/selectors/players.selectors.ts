import { createSelector } from '@ngrx/store';
import { playersAdapter } from '../adapters';
import { playersFeature } from './players-feature.selector';

const players = createSelector(playersFeature, feature => feature.players);
export const playersLocked = createSelector(players, feature => feature.locked);

const { selectEntities, selectAll } = playersAdapter.getSelectors();
const playerEntities = createSelector(players, selectEntities);
export const allPlayers = createSelector(players, selectAll);

export const playerById = (playerId: string) => createSelector(playerEntities, entites => entites[playerId]);
