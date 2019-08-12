import { EntityState } from '@ngrx/entity';
import { PlayerBan } from '../models/player-ban';
import { playerBansAdapter as adapter } from '../adapters';
import { createReducer, Action, on } from '@ngrx/store';
import { playerBansLoaded, revokePlayerBan, playerBanUpdated, addPlayerBan, playerBanAdded } from '../actions';

export interface State extends EntityState<PlayerBan> {
  locked: boolean;
}

const initialState: State = adapter.getInitialState({
  locked: false,
});

const playerBansReducer = createReducer(
  initialState,
  on(playerBansLoaded, (state, { playerBans }) => adapter.addMany(playerBans, state)),
  on(addPlayerBan, state => ({ ...state, locked: true })),
  on(playerBanAdded, (state, { playerBan }) => ({ ...adapter.addOne(playerBan, state), locked: false })),
  on(revokePlayerBan, state => ({ ...state, locked: true })),
  on(playerBanUpdated, (state, { playerBan }) => ({ ...adapter.upsertOne(playerBan, state), locked: false })),
);

export function reducer(state: State | undefined, action: Action) {
  return playerBansReducer(state, action);
}
