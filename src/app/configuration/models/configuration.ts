import { Tf2ClassName } from '@app/shared/models/tf2-class-name';

export interface Configuration {
  defaultPlayerSkill?: { [className in Tf2ClassName]?: number };
  whitelistId?: string;
}
