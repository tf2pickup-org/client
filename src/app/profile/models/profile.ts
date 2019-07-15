import { PlayerRole } from '@app/players/models/player-role';

export interface Profile {
  id: string;
  steamId: string;
  name: string;
  joinedAt: Date;
  activeGameId: string;
  role: PlayerRole;
}
