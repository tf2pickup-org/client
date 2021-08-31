import { ConfigurationEntryKey } from '../configuration-entry-key';
import { MumbleOptions } from './mumble-options';

export enum SelectedVoiceServer {
  none = 'none',
  staticLink = 'static link',
  mumble = 'mumble',
}

export interface VoiceServer {
  key: ConfigurationEntryKey.voiceServer;
  type: SelectedVoiceServer;
  staticLink?: string;
  mumble?: MumbleOptions;
}
