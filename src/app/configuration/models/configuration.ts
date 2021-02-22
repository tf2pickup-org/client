import { Tf2ClassName } from '@app/shared/models/tf2-class-name';

export interface Configuration {
  defaultPlayerSkill?: Map<Tf2ClassName, number>;
  whitelistId?: string;
}
