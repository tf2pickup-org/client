import { createSelector } from '@ngrx/store';
import { isBanned, isLoggedIn } from './profile/profile.selectors';
import { activeGame, isGameRunning } from './games/games.selectors';
import { isPreReadied, mySlot, queueState } from './queue/queue.selectors';

// some root-state selectors

export const canJoinQueue = createSelector(
  isLoggedIn,
  activeGame,
  isBanned,
  // eslint-disable-next-line no-shadow
  (isLoggedIn, activeGame, isBanned) => isLoggedIn && !activeGame && !isBanned
);

export const canSubstituteInGame = (gameId: string) => createSelector(
  isLoggedIn,
  isGameRunning(gameId),
  isBanned,
  activeGame,
  // eslint-disable-next-line no-shadow
  (isLoggedIn, isTheGameRunning, isBanned, activeGame) =>
    isLoggedIn &&
    isTheGameRunning &&
    !isBanned &&
    (!activeGame || activeGame.id === gameId)
);

export const awaitsReadyUp = createSelector(
  queueState,
  mySlot,
  isPreReadied,
  // eslint-disable-next-line no-shadow
  (queueState, mySlot, isPreReadied) =>
    queueState === 'ready'
    && (!!mySlot && !mySlot.ready)
    && !isPreReadied
);
