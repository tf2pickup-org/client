import { EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { GameServer } from './models/game-server';

export const adapter: EntityAdapter<GameServer> = createEntityAdapter<GameServer>();
