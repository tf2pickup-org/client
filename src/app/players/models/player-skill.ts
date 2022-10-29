import { Tf2ClassName } from '@app/shared/models/tf2-class-name';
import { Player } from './player';

export interface PlayerSkill extends Player {
  skill: { [gameClass in Tf2ClassName]?: number };
}
