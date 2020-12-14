import { Player } from '../models/player';

export interface PlayerGroup {
  key: string;
  players: Player[];
}
