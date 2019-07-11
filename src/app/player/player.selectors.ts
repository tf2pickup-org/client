import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState } from '../app.state';
import { State } from './player.reducer';
import { adapter } from './player.adapter';

const playerFeature = createFeatureSelector<AppState, State>('players');
const { selectEntities } = adapter.getSelectors();
const playerEntities = createSelector(playerFeature, selectEntities);

export const playerById = (playerId: string) => createSelector(playerEntities, entites => entites[playerId]);
