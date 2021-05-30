import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { LinkedProfiles } from '../models/linked-profiles';

export const adapter: EntityAdapter<LinkedProfiles> = createEntityAdapter({
  selectId: entity => entity.playerId,
});
