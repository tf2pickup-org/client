import { GamePlayer } from './game-player';
import { GameState } from './game-state';

export interface Game {
  launchedAt: Date;
  number: number;
  teams: { [teamId: string]: string };
  players: GamePlayer[];
  map: string;
  logsUrl?: string;
  demoUrl?: string;
  state: GameState;
}
