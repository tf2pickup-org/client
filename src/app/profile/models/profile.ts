import { PlayerRole } from '@app/players/models/player-role';
import { PlayerBan } from '@app/players/models/player-ban';
import { PlayerAvatar } from '@app/players/models/player-avatar';

export interface Profile {
  id: string;
  name: string;
  joinedAt: Date;
  steamId: string;
  avatar: PlayerAvatar;
  role?: PlayerRole;
  etf2lProfileId?: number;

  activeGameId: string;
  hasAcceptedRules: boolean;
  bans: PlayerBan[];
  mapVote?: string;

  twitchTvUser?: {
    userId: string;
    login: string;
    displayName: string;
    profileImageUrl: string;
  };

  preferences: {
    [key: string]: string;
  };
}
