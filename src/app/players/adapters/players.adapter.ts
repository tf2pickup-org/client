import { EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Player } from '../models/player';

function sortByName(a: Player, b: Player): number {
  return a.name.localeCompare(b.name);
}

export const adapter: EntityAdapter<Player> = createEntityAdapter<Player>({
  sortComparer: sortByName,
});
