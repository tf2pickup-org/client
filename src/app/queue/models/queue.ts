import { GameClass } from './game-class';
import { Player } from 'src/app/player/models/player';

export interface Queue {
  classes: GameClass[];
  players: Player[];
}
