import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState } from '@app/app.state';
import { State } from './io.reducer';

const ioFeature = createFeatureSelector<AppState, State>('io');

export const ioConnected = createSelector(ioFeature, io => io.connected);
