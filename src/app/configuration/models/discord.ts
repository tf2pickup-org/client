import { ConfigurationEntryKey } from '../configuration-entry-key';

interface DiscordGuildOptions {
  guildId: string;
  queueNotificationsChannelId?: string;
  substituteMentionRole?: string;
  adminNotificationsChannelId?: string;
}

export interface Discord {
  key: ConfigurationEntryKey.discord;
  guilds: DiscordGuildOptions[];
}
