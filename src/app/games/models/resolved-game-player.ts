import { Player } from '@app/players/models/player';
import { GamePlayer } from './game-player';

export type ResolvedGamePlayer = Player & GamePlayer & { classSkill?: number };

