import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { GameServersService } from './game-servers.service';
import {
  loadGameServers,
  gameServersLoaded,
  loadGameServer,
  gameServerLoaded,
} from './game-servers.actions';
import { mergeMap, map } from 'rxjs/operators';

@Injectable()
export class GameServersEffects {
  loadGameServers = createEffect(() => {
    return this.actions.pipe(
      ofType(loadGameServers),
      mergeMap(() =>
        this.gameServersService
          .fetchGameServers()
          .pipe(map(gameServers => gameServersLoaded({ gameServers }))),
      ),
    );
  });

  loadGameServer = createEffect(() => {
    return this.actions.pipe(
      ofType(loadGameServer),
      mergeMap(({ gameServerId }) =>
        this.gameServersService
          .fetchGameServer(gameServerId)
          .pipe(map(gameServer => gameServerLoaded({ gameServer }))),
      ),
    );
  });

  constructor(
    private actions: Actions,
    private gameServersService: GameServersService,
  ) {}
}
