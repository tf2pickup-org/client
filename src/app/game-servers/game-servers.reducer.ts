import { EntityState } from '@ngrx/entity';
import { GameServer } from './models/game-server';
import { adapter } from './game-servers.adapter';
import { createReducer, on, Action } from '@ngrx/store';
import { gameServersLoaded, gameServerAdded, addGameServer, removeGameServer, gameServerRemoved, failedToAddGameServer,
  gameServerLoaded } from './game-servers.actions';

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
  on(gameServersLoaded, (state, { gameServers }) => ({ ...adapter.setAll(gameServers, state), loaded: true })),
  on(gameServerLoaded, (state, { gameServer }) => ({ ...adapter.upsertOne(gameServer, state) })),
  on(addGameServer, state => ({ ...state, locked: true })),
  on(gameServerAdded, (state, { gameServer }) => ({ ...adapter.addOne(gameServer, state), locked: false })),
  on(failedToAddGameServer, state => ({ ...state, locked: false })),
  on(removeGameServer, state => ({ ...state, locked: true })),
  on(gameServerRemoved, (state, { gameServerId }) => ({ ...adapter.removeOne(gameServerId, state), locked: false })),
);

export function reducer(state: State | undefined, action: Action) {
  return gameServerReducer(state, action);
}
