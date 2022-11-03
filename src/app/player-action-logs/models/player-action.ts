import { Player } from '@app/players/models/player';

export interface PlayerAction {
  player: Player;
  timestamp: Date;
  action: string;

  ipAddress?: string;
  userAgent?: string;
}
