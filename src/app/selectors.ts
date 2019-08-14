import { createSelector } from '@ngrx/store';
import { profile } from './profile/profile.selectors';
import { activeGame } from './games/games.selectors';

// some root-state selectors

export const queueLocked = createSelector(
  profile,
  activeGame,
  (theProfile, game) => {
    return !theProfile // user not logged in
      || !!game // user has active game going on
      || theProfile.bans && theProfile.bans.length > 0 // user is banned
      ;
  }
);
