import { PlayerRole } from './player-role';
import { PlayerStats } from './player-stats';
import { PlayerAvatar } from './player-avatar';

export interface Player {
  id: string;
  name: string;
  joinedAt: Date;
  steamId: string;
  avatar: PlayerAvatar;
  role?: PlayerRole;
  etf2lProfileId?: number;

  skill?: Record<string, number>;
  stats?: PlayerStats;

  twitchTvUser?: {
    userId: string;
    login: string;
    displayName: string;
    profileImageUrl: string;
  };
}
