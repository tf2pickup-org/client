import { createReducer, on, Action } from "@ngrx/store";
import { ioConnected, ioDisconnected } from './io.actions';

export interface State {
  connected: boolean;
}

export const initialState: State = {
  connected: false,
};

const ioReducer = createReducer(
  initialState,
  on(ioConnected, state => ({ ...state, connected: true })),
  on(ioDisconnected, state => ({ ...state, connected: false })),
)

export function reducer(state: State, action: Action) {
  return ioReducer(state, action);
}
