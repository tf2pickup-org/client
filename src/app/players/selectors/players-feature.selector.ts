import { createFeatureSelector } from '@ngrx/store';
import { AppState } from '@app/app.state';
import { State } from '../reducers';

export const playersFeature = createFeatureSelector<AppState, State>('players');
