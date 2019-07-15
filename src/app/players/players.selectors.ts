import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState } from '../app.state';
import { State } from './players.reducer';
import { adapter } from './players.adapter';

const playersFeature = createFeatureSelector<AppState, State>('players');
export const playersLocked = createSelector(playersFeature, feature => feature.locked);

const { selectEntities } = adapter.getSelectors();
const playerEntities = createSelector(playersFeature, selectEntities);

export const playerById = (playerId: string) => createSelector(playerEntities, entites => entites[playerId]);
