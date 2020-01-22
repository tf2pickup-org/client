import { PlayerConnectionStatus } from './player-connection-status';

export interface GamePlayer {
  playerId: string;
  teamId: string;
  gameClass: string;
  connectionStatus: PlayerConnectionStatus;
  status: 'active' | 'waiting for substitute' | 'replaced';
}
