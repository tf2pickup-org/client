import { PlayerBan } from '@app/players/models/player-ban';
import { Player } from '@app/players/models/player';
import { LinkedProfile } from '@app/players/models/linked-profile';

export interface Profile {
  player: Player;

  activeGameId: string;
  bans: PlayerBan[];
  mapVote?: string;

  preferences: {
    [key: string]: string;
  };

  hasAcceptedRules: boolean;

  linkedProfiles?: LinkedProfile[];
}
