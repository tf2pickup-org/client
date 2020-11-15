import { EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { PlayerBan } from '../models/player-ban';

export const adapter: EntityAdapter<PlayerBan> = createEntityAdapter<PlayerBan>({
  sortComparer: (a: PlayerBan, b: PlayerBan) => new Date(b.start).getTime() - new Date(a.start).getTime(),
});
