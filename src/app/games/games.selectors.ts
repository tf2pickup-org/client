import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState } from '@app/app.state';
import { State } from './games.reducer';
import { adapter } from './games.adapter';
import { profile } from '@app/profile/profile.selectors';
import * as urlParse from 'url-parse';

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
  (theProfile, games) => theProfile && games?.find(g => g.players.includes(theProfile.id))
);

export const isPlayingGame = createSelector(
  activeGame,
  game => !!game,
);

export const playerSlot = (gameId: string, playerId: string) => createSelector(
  gameById(gameId),
  game => game?.slots.find(s => s.playerId === playerId)
);

export const isGameRunning = (gameId: string) => createSelector(
  gameById(gameId),
  game => /launching|started/.test(game.state)
);

export const isMyGame = (gameId: string) => createSelector(
  profile,
  gameById(gameId),
  (theProfile, game) => !!game?.slots.find(s => s.playerId === theProfile?.id)?.status.match(/active|waiting for substitute/)
);

export const mumbleUrl = (gameId: string) => createSelector(
  gameById(gameId),
  profile,
  (game, theProfile) => {
    if (!game?.mumbleUrl) {
      return null;
    }

    const mySlot = game?.slots.find(s => s.playerId === theProfile?.id);
    if (!mySlot) {
      return null;
    }

    const team = game.teams[mySlot.teamId];
    const url = urlParse(game.mumbleUrl);
    url.set('username', theProfile.name.replace(/\s+/g, '_'));
    return `${url.toString()}/${team}`;
  }
);

export const gameScore = (gameId: string, team: 'blu' | 'red') => createSelector(
  gameById(gameId),
  game => {
    const teamId = Object.keys(game.teams).find(key => game.teams[key].toLowerCase() === team);
    return game.score?.[teamId];
  }
);
