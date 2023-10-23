export interface GuildConfiguration {
  id: string;
  substituteNotifications?: {
    channel?: string;
    role?: string;
  };
  queuePrompts?: {
    channel?: string;
  };
  adminNotifications?: {
    channel?: string;
  };
}
