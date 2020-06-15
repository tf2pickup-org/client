import { GamePlayer } from './game-player';
import { GameState } from './game-state';
import { Tf2Team } from './tf2-team';

export interface Game {
  id: string;
  launchedAt: Date;
  number: number;
  slots: GamePlayer[];
  map: string;
  logsUrl?: string;
  demoUrl?: string;
  state: GameState;
  connectString?: string;
  mumbleUrl: string;
  error?: string;
  gameServer?: string;
  stvConnectString?: string;
  score?: Record<Tf2Team, number>;
}
