import { createAction, props } from '@ngrx/store';
import { TwitchStream } from './models/twitch-stream';

export const loadTwitchStreams = createAction('[Init] Load Twitch streams');

export const twitchStreamsLoaded = createAction(
  '[API] Twitch streams loaded',
  props<{ twitchStreams: TwitchStream[] }>(),
);

export const twitchStreamsUpdated = createAction(
  '[WS] Twitch streams updated',
  props<{ twitchStreams: TwitchStream[] }>(),
);
