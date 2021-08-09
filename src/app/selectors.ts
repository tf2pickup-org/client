import { createSelector } from '@ngrx/store';
import {
  activeGameId,
  isBanned,
  isLoggedIn,
} from './profile/profile.selectors';
import { mySlot, queueState } from './queue/queue.selectors';
import { ioConnected } from './io/io.selectors';

// some root-state selectors

export const canJoinQueue = createSelector(
  ioConnected,
  isLoggedIn,
  activeGameId,
  isBanned,
  (ioConnected, isLoggedIn, activeGameId, isBanned) =>
    ioConnected && isLoggedIn && !activeGameId && !isBanned,
);

export const awaitsReadyUp = createSelector(
  queueState,
  mySlot,
  (queueState, mySlot) => queueState === 'ready' && !!mySlot && !mySlot.ready,
);
