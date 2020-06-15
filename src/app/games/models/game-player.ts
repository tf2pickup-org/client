import { PlayerConnectionStatus } from './player-connection-status';
import { Tf2Team } from './tf2-team';

export interface GamePlayer {
  player: string;
  team: Tf2Team;
  gameClass: string;
  connectionStatus: PlayerConnectionStatus;
  status: 'active' | 'waiting for substitute' | 'replaced';
}
