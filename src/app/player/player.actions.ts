import { createAction, props } from '@ngrx/store';
import { Player } from './models/player';

export const loadPlayers = createAction('[Init] Load players');
export const playersLoaded = createAction('[API] Players loaded', props<{ players: Player[] }>());
