import { TextChannelInfo } from './text-channel-info';
import { RoleInfo } from './role-info';

export interface GuildInfo {
  id: string;
  name: string;
  icon: string;

  textChannels?: TextChannelInfo[];
  roles?: RoleInfo[];
}
