import { createSelector } from '@ngrx/store';
import { playersFeature } from './players-feature.selector';
import { playerBansAdapter } from '../adapters';

const bans = createSelector(playersFeature, feature => feature.bans);
export const playerBansLocked = createSelector(bans, pb => pb.locked);

const { selectAll } = playerBansAdapter.getSelectors();
const allBans = createSelector(bans, selectAll);

export const playerBans = (playerId: string) => createSelector(allBans, _bans => _bans.filter(b => b.player === playerId));
