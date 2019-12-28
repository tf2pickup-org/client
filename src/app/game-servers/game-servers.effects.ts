import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { GameServersService } from './game-servers.service';
import { loadGameServers, gameServersLoaded, addGameServer, gameServerAdded, removeGameServer,
  gameServerRemoved, failedToAddGameServer, loadGameServer, gameServerLoaded} from './game-servers.actions';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

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

  loadGameServer = createEffect(() =>
    this.actions.pipe(
      ofType(loadGameServer),
      mergeMap(({ gameServerId }) => this.gameServersService.fetchGameServer(gameServerId).pipe(
        map(gameServer => gameServerLoaded({ gameServer })),
      )),
    )
  );

  addGameServer = createEffect(() =>
    this.actions.pipe(
      ofType(addGameServer),
      mergeMap(({ gameServer }) => this.gameServersService.addGameServer(gameServer).pipe(
        map(addedGameServer => gameServerAdded({ gameServer: addedGameServer })),
        catchError(error => {
          if (error instanceof HttpErrorResponse) {
            return of(failedToAddGameServer({ error: error.error.message }));
          } else {
            return throwError(error);
          }
        }),
      )),
    )
  );

  removeGameServer = createEffect(() =>
    this.actions.pipe(
      ofType(removeGameServer),
      mergeMap(({ gameServerId }) => this.gameServersService.removeGameServer(gameServerId).pipe(
        map(() => gameServerRemoved({ gameServerId })),
      )),
    )
  );

  constructor(
    private actions: Actions,
    private gameServersService: GameServersService,
  ) { }

}
