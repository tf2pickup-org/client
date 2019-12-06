import { PlayerRole } from '@app/players/models/player-role';
import { PlayerBan } from '@app/players/models/player-ban';

export interface Profile {
  id: string;
  steamId: string;
  avatarUrl: string;
  name: string;
  joinedAt: Date;
  activeGameId: string;
  role: PlayerRole;
  hasAcceptedRules: boolean;
  etf2lProfileId: number;
  bans: PlayerBan[];
  mapVote?: string;
}
