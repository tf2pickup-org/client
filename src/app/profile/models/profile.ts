import { PlayerBan } from '@app/players/models/player-ban';
import { Player } from '@app/players/models/player';

export interface Profile {
  player: Player;

  activeGameId: string;
  bans: PlayerBan[];
  mapVote?: string;

  preferences: {
    [key: string]: string;
  };

  hasAcceptedRules: boolean;
}
