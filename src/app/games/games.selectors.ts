import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState } from '@app/app.state';
import { State } from './games.reducer';
import { adapter } from './games.adapter';
import { profile } from '@app/profile/profile.selectors';

const gamesFeature = createFeatureSelector<AppState, State>('games');
export const gamesLoaded = createSelector(gamesFeature, games => games.loaded);

const { selectAll, selectEntities } = adapter.getSelectors();
export const allGames = createSelector(gamesFeature, selectAll);

const gameEntities = createSelector(gamesFeature, selectEntities);
export const gameById = (gameId: string) => createSelector(gameEntities, entities => entities[gameId]);

export const activeGames = createSelector(
  allGames,
  games => games && games.filter(g => g.state === 'launching' || g.state === 'started')
);

export const activeGame = createSelector(
  profile,
  activeGames,
  (theProfile, games) => theProfile && games && games.find(g => g.players.includes(theProfile.id))
);
