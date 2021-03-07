import { PlayerRole } from '@app/players/models/player-role';
import { PlayerBan } from '@app/players/models/player-ban';
import { PlayerAvatar } from '@app/players/models/player-avatar';
import { Player } from '@app/players/models/player';

export interface Profile {
  player: Player;

  activeGameId: string;
  bans: PlayerBan[];
  mapVote?: string;

  preferences: {
    [key: string]: string;
  };
}
