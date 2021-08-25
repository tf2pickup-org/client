import { EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Player } from '../models/player';

export const adapter: EntityAdapter<Player> = createEntityAdapter<Player>({
  sortComparer: (a: Player, b: Player) => a.name.localeCompare(b.name),
});
