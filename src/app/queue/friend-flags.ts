import { Player } from '@app/players/models/player';

export interface FriendFlags {
  canMarkAsFriend: boolean;
  markedByMe?: boolean;
  markedBy?: Player;
}
