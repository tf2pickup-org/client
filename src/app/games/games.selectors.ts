import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState } from '@app/app.state';
import { State } from './games.reducer';
import { adapter } from './games.adapter';
import { currentPlayer } from '@app/profile/profile.selectors';

const gamesFeature = createFeatureSelector<AppState, State>('games');

const { selectAll, selectEntities } = adapter.getSelectors();
export const allGames = createSelector(gamesFeature, selectAll);

const gameEntities = createSelector(gamesFeature, selectEntities);
export const gameById = (gameId: string) =>
  createSelector(gameEntities, entities => entities[gameId]);

export const activeGames = createSelector(allGames, games =>
  games.filter(g => /launching|started/.test(g.state)),
);

export const activeGame = createSelector(
  currentPlayer,
  activeGames,
  (player, games) =>
    player && games?.find(g => g.slots.find(s => s.player === player.id)),
);

export const activeGameId = createSelector(
  activeGame,
  activeGame => activeGame?.id,
);

export const isPlayingGame = createSelector(activeGame, game => !!game);
