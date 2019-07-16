import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState } from '@app/app.state';
import { State } from './game-servers.reducer';
import { adapter } from './game-servers.adapter';

const gameServersFeature = createFeatureSelector<AppState, State>('gameServers');

export const gameServersLocked = createSelector(gameServersFeature, feature => feature.locked);

const { selectAll } = adapter.getSelectors();
export const allGameServers = createSelector(gameServersFeature, selectAll);

export const gameServersLoaded = createSelector(gameServersFeature, feature => feature.loaded);
export const gameServerByName = (name: string) => createSelector(
  allGameServers,
  servers => servers.find(s => s.name === name)
);
