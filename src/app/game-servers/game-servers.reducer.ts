import { EntityState } from '@ngrx/entity';
import { GameServer } from './models/game-server';
import { adapter } from './game-servers.adapter';
import { createReducer, on, Action } from '@ngrx/store';
import { gameServersLoaded, gameServerLoaded } from './game-servers.actions';

export interface State extends EntityState<GameServer> {
  loaded: boolean;
  locked: boolean;
}

const initialState: State = adapter.getInitialState({
  loaded: false,
  locked: false,
});

const gameServerReducer = createReducer(
  initialState,
  on(gameServersLoaded, (state, { gameServers }) => ({
    ...adapter.setAll(gameServers, state),
    loaded: true,
  })),
  on(gameServerLoaded, (state, { gameServer }) => ({
    ...adapter.upsertOne(gameServer, state),
  })),
);

export const reducer = (state: State | undefined, action: Action) =>
  gameServerReducer(state, action);
