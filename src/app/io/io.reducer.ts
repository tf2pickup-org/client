import { createReducer, on, Action } from '@ngrx/store';
import { ioConnected, ioDisconnected } from './io.actions';

export interface State {
  connected?: boolean;
}

export const initialState: State = { };

const ioReducer = createReducer(
  initialState,
  on(ioConnected, state => ({ ...state, connected: true })),
  on(ioDisconnected, state => ({ ...state, connected: false })),
);

export const reducer = (state: State, action: Action) => ioReducer(state, action);
