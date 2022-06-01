import { PlayerConnectionStatus } from './player-connection-status';
import { Tf2Team } from './tf2-team';
import { SlotStatus } from './slot-status';
import { Player } from '@app/players/models/player';

export interface GameSlot {
  player: Player;
  team: Tf2Team;
  gameClass: string;
  connectionStatus: PlayerConnectionStatus;
  status: SlotStatus;
}
