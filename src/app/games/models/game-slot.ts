import { PlayerConnectionStatus } from './player-connection-status';
import { Tf2Team } from './tf2-team';
import { SlotStatus } from './slot-status';

export interface GameSlot {
  player: string;
  team: Tf2Team;
  gameClass: string;
  connectionStatus: PlayerConnectionStatus;
  status: SlotStatus;
}
