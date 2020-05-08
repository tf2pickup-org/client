import { TwitchStream } from './models/twitch-stream';
import { createReducer, Action, on } from '@ngrx/store';
import { twitchStreamsLoaded, twitchStreamsUpdated } from './twitch.actions';

export interface State {
  streams: TwitchStream[];
}

const initialState: State = {
  streams: [],
};

const twitchReducer = createReducer(
  initialState,
  on(twitchStreamsLoaded, (state, { twitchStreams }) => ({ ...state, streams: twitchStreams })),
  on(twitchStreamsUpdated, (state, { twitchStreams }) => ({ ...state, streams: twitchStreams })),
);

export function reducer(state: State | undefined, action: Action) {
  return twitchReducer(state, action);
}
