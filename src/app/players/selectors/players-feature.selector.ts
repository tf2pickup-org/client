import { createFeatureSelector } from '@ngrx/store';
import { State } from '../reducers';

export const playersFeature = createFeatureSelector<State>('players');
