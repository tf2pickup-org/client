import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { GameServersService } from './game-servers.service';
import { loadGameServers, gameServersLoaded, addGameServer, gameServerAdded } from './game-servers.actions';
import { mergeMap, map } from 'rxjs/operators';

@Injectable()
export class GameServersEffects {

  loadGameServers = createEffect(() =>
    this.actions.pipe(
      ofType(loadGameServers),
      mergeMap(() => this.gameServersService.fetchGameServers().pipe(
        map(gameServers => gameServersLoaded({ gameServers })),
      )),
    )
  );

  addGameServer = createEffect(() =>
    this.actions.pipe(
      ofType(addGameServer),
      mergeMap(({ gameServer }) => this.gameServersService.addGameServer(gameServer).pipe(
        map(addedGameServer => gameServerAdded({ gameServer: addedGameServer })),
      ))
    )
  );

  constructor(
    private actions: Actions,
    private gameServersService: GameServersService,
  ) { }

}
