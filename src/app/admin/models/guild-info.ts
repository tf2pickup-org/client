import { TextChannelInfo } from './text-channel-info';

export interface GuildInfo {
  id: string;
  name: string;
  icon: string;

  textChannels?: TextChannelInfo[];
}
