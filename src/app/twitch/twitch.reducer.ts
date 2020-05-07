import { TwitchStream } from './models/twitch-stream';
import { createReducer, Action } from '@ngrx/store';

export interface State {
  streams: TwitchStream[];
}

const initialState: State = {
  streams: [
    {
      playerId: '5d448875b963ff7e00c6b6b3',
      id: '1481304945',
      userName: 'kazachuu',
      title: 'Virtus.pro 1-1 Team Spirit | BO3 | KVYZEE & Shadowehh | WePlay! Pushka League',
      viewerCount: 43170,
      thumbnailUrl: 'https://static-cdn.jtvnw.net/previews-ttv/live_user_weplayesport_ru-{width}x{height}.jpg',
    },
  ]
};

const twitchReducer = createReducer(
  initialState,
);

export function reducer(state: State | undefined, action: Action) {
  return twitchReducer(state, action);
}
