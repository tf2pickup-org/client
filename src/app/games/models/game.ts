import { GamePlayer } from './game-player';
import { GameState } from './game-state';

export interface Game {
  id: string;
  launchedAt: Date;
  number: number;
  teams: { [teamId: string]: string };
  slots: GamePlayer[];
  players: string[];
  map: string;
  logsUrl?: string;
  demoUrl?: string;
  state: GameState;
}
