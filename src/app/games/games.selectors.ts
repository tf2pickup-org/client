import { createFeatureSelector, createSelector } from '@ngrx/store';
import { State } from './games.reducer';
import { adapter } from './games.adapter';

const gamesFeature = createFeatureSelector<State>('games');

const { selectAll, selectEntities } = adapter.getSelectors();
export const allGames = createSelector(gamesFeature, selectAll);

const gameEntities = createSelector(gamesFeature, selectEntities);

export const gameById = (gameId: string) =>
  createSelector(gameEntities, entities => entities[gameId]);
