import { PlayerRole } from './player-role';
import { PlayerStats } from './player-stats';

export interface Player {
  id: string;
  name: string;
  joinedAt: Date;
  steamId: string;
  avatarUrl: string;
  role?: PlayerRole;
  etf2lProfileId?: number;
  skill?: { [gameClass: string]: number };
  stats?: PlayerStats;
  twitchTvUser?: {
    userId: string;
    login: string;
    displayName: string;
    profileImageUrl: string;
  };
}
