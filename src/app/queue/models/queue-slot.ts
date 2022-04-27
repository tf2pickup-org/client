import { Player } from '@app/players/models/player';
import { Tf2ClassName } from '@app/shared/models/tf2-class-name';

export interface QueueSlot {
  id: number;
  gameClass: Tf2ClassName;
  ready: boolean;
  playerId?: string;
  player?: Player;
  canMakeFriendsWith?: Tf2ClassName[];
}
