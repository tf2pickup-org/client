import { PlayerRole } from './player-role';

export interface Player {
  id: string;
  name: string;
  joinedAt: Date;
  steamId: string;
  avatarUrl: string;
  role?: PlayerRole;
}
