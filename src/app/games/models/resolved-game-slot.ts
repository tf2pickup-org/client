import { Player } from '@app/players/models/player';
import { GameSlot } from './game-slot';

export type ResolvedGameSlot = Player & GameSlot & { classSkill?: number };

