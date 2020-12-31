import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { PlayerSkill } from '../models/player-skill';

export const adapter: EntityAdapter<PlayerSkill> = createEntityAdapter<PlayerSkill>({
  selectId: skill => skill.player,
});
