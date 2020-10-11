import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState } from '@app/app.state';
import { State } from './games.reducer';
import { adapter } from './games.adapter';
import { profile } from '@app/profile/profile.selectors';
import { Tf2Team } from './models/tf2-team';

const gamesFeature = createFeatureSelector<AppState, State>('games');

const { selectAll, selectEntities } = adapter.getSelectors();
export const allGames = createSelector(gamesFeature, selectAll);

const gameEntities = createSelector(gamesFeature, selectEntities);
export const gameById = (gameId: string) => createSelector(gameEntities, entities => entities[gameId]);

export const activeGames = createSelector(
  allGames,
  games => games?.filter(g => /launching|started/.test(g.state))
);

export const activeGame = createSelector(
  profile,
  activeGames,
  (theProfile, games) => theProfile && games?.find(g => g.slots.find(s => s.player === theProfile.id))
);

export const isPlayingGame = createSelector(
  activeGame,
  game => !!game,
);

export const playerSlot = (gameId: string, playerId: string) => createSelector(
  gameById(gameId),
  game => game?.slots.find(s => s.player === playerId)
);

export const isGameRunning = (gameId: string) => createSelector(
  gameById(gameId),
  game => /launching|started/.test(game.state)
);

export const isMyGame = (gameId: string) => createSelector(
  profile,
  gameById(gameId),
  (theProfile, game) => !!game?.slots.find(s => s.player === theProfile?.id)?.status.match(/active|waiting for substitute/)
);

export const mumbleUrl = (gameId: string) => createSelector(
  gameById(gameId),
  profile,
  (game, theProfile) => {
    if (!game?.mumbleUrl) {
      return null;
    }

    const mySlot = game?.slots.find(s => s.player === theProfile?.id);
    if (!mySlot) {
      return null;
    }

    const url = new URL(game.mumbleUrl);

    // https://stackoverflow.com/questions/64299675/why-the-url-class-does-not-support-setting-username-for-protocols-other-than-htt
    const protocol = url.protocol;
    url.protocol = 'http:';
    url.username = theProfile.name.replace(/\s+/g, '_');
    url.pathname += '/' + mySlot.team.toUpperCase();
    url.protocol = protocol;

    return url.toString();
  }
);

export const gameScore = (gameId: string, team: Tf2Team) => createSelector(
  gameById(gameId),
  game => game.score?.[team]
);
