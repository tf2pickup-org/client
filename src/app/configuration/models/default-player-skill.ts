import { Tf2ClassName } from '@app/shared/models/tf2-class-name';
import { ConfigurationEntryKey } from '../configuration-entry-key';

export interface DefaultPlayerSkill {
  key: ConfigurationEntryKey.defaultPlayerSkill;
  value: { [gameClass in Tf2ClassName]?: number };
}
