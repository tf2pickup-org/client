import { EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Game } from './models/game';

export const adapter: EntityAdapter<Game> = createEntityAdapter<Game>({
  sortComparer: (a, b) => {
    if (a.number < b.number) {
      return 1;
    } else if (a.number > b.number) {
      return -1;
    } else {
      return 0;
    }
  },
});
