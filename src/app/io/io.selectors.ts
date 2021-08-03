import { createFeatureSelector, createSelector } from '@ngrx/store';
import { State } from './io.reducer';

const ioFeature = createFeatureSelector<State>('io');

export const ioConnected = createSelector(ioFeature, io => io.connected);
