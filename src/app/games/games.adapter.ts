import { EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Game } from './models/game';

export const adapter: EntityAdapter<Game> = createEntityAdapter<Game>();
