import { GameSlot } from './game-slot';
import { GameState } from './game-state';
import { Tf2Team } from './tf2-team';

export interface Game {
  id: string;
  launchedAt: Date;
  // eslint-disable-next-line id-blacklist
  number: number;
  slots: GameSlot[];
  map: string;
  logsUrl?: string;
  demoUrl?: string;
  state: GameState;
  mumbleUrl?: string;
  error?: string;
  gameServer?: string;
  stvConnectString?: string;
  score?: Record<Tf2Team, number>;
  connectInfoVersion: number;
}
