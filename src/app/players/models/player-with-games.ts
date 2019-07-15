import { Player } from './player';
import { Game } from '@app/games/models/game';

export interface PlayerWithGames extends Player {
  games: Game[];
}
