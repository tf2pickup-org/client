import { createSelector } from '@ngrx/store';
import { isBanned, isLoggedIn } from './profile/profile.selectors';
import { activeGame } from './games/games.selectors';
import { mySlot, queueState } from './queue/queue.selectors';

// some root-state selectors

export const canJoinQueue = createSelector(
  isLoggedIn,
  activeGame,
  isBanned,
  // eslint-disable-next-line no-shadow
  (isLoggedIn, activeGame, isBanned) => isLoggedIn && !activeGame && !isBanned
);

export const awaitsReadyUp = createSelector(
  queueState,
  mySlot,
  // eslint-disable-next-line no-shadow
  (queueState, mySlot) =>
    queueState === 'ready'
    && (!!mySlot && !mySlot.ready)
);
