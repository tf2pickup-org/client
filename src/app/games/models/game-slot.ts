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

  // The classSkill field is not a part of the API, but we're
  // resolving it for admins.
  classSkill?: number;
}
