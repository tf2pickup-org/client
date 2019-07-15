import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState } from '../app.state';
import { State } from './players.reducer';
import { adapter } from './players.adapter';

const playerFeature = createFeatureSelector<AppState, State>('players');
const { selectEntities } = adapter.getSelectors();
const playerEntities = createSelector(playerFeature, selectEntities);

export const playerById = (playerId: string) => createSelector(playerEntities, entites => entites[playerId]);
