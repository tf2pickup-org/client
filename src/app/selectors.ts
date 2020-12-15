import { createSelector } from '@ngrx/store';
import { profile, isBanned, isLoggedIn } from './profile/profile.selectors';
import { activeGame, isGameRunning, gameById } from './games/games.selectors';
import { isPreReadied, mySlot, queueState } from './queue/queue.selectors';

// some root-state selectors

export const queueLocked = createSelector(
  profile,
  activeGame,
  (theProfile, game) =>
    !theProfile // user not logged in
    || !!game // user has active game going on
    || theProfile.bans && theProfile.bans.length > 0 // user is banned
);

export const canSubstituteInGame = (gameId: string) => createSelector(
  isLoggedIn,
  isGameRunning(gameId),
  isBanned,
  activeGame,
  gameById(gameId),
  (loggedIn, gameRunning, banned, theActiveGame, game) =>
    loggedIn &&
    gameRunning &&
    !banned &&
    (!theActiveGame || theActiveGame.id === game.id)
);

export const isReadyUpDialogShown = createSelector(
  queueState,
  mySlot,
  isPreReadied,
  (state, slot, preReadied) =>
    state === 'ready'
    && (!!slot && !slot.ready)
    && !preReadied
);
