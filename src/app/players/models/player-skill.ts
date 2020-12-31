import { Tf2ClassName } from '@app/shared/models/tf2-class-name';

export interface PlayerSkill {
  player: string;
  skill: {
    [className in Tf2ClassName]?: number;
  };
}
