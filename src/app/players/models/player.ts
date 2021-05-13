import { PlayerRole } from './player-role';
import { PlayerStats } from './player-stats';
import { PlayerAvatar } from './player-avatar';
import { Link } from '@app/shared/models/link';

export interface Player {
  id: string;
  name: string;
  joinedAt: Date;
  steamId: string;
  avatar: PlayerAvatar;
  roles: PlayerRole[];
  etf2lProfileId?: number;

  skill?: Record<string, number>;
  stats?: PlayerStats;

  _links: Link[];
}
