import { createSelector } from '@ngrx/store';
import {
  activeGameId,
  isBanned,
  isLoggedIn,
  restrictions,
} from './profile/profile.selectors';
import { mySlot, queueState } from './queue/queue.selectors';
import { ioConnected } from './io/io.selectors';
import { Tf2ClassName } from './shared/models/tf2-class-name';

// some root-state selectors

export const canJoinQueue = (gameClass: Tf2ClassName) =>
  createSelector(
    ioConnected,
    isLoggedIn,
    activeGameId,
    isBanned,
    restrictions,
    (ioConnected, isLoggedIn, activeGameId, isBanned, restrictions) =>
      ioConnected &&
      isLoggedIn &&
      !activeGameId &&
      !isBanned &&
      !restrictions?.find(r => r.gameClasses?.includes(gameClass)),
  );

export const awaitsReadyUp = createSelector(
  queueState,
  mySlot,
  (queueState, mySlot) => queueState === 'ready' && !!mySlot && !mySlot.ready,
);
