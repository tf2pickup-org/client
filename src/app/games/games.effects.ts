import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType, concatLatestFrom } from '@ngrx/effects';
import { GamesService } from './games.service';
import {
  gameAdded,
  loadGame,
  gameUpdated,
  forceEndGame,
  gameCreated,
  reinitializeServer,
  ownGameAdded,
  requestSubstitute,
  cancelSubstitutionRequest,
} from './games.actions';
import { mergeMap, map, filter } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { currentPlayer } from '@app/profile/profile.selectors';
import { profileLoaded } from '@app/profile/profile.actions';
import { Router } from '@angular/router';
import { routerNavigatedAction } from '@ngrx/router-store';
import { Socket } from '@app/io/socket';
import { fromEvent } from 'rxjs';
import { Game } from './models/game';

@Injectable({ providedIn: 'root' })
export class GamesEffects {
  loadGame = createEffect(() => {
    return this.actions.pipe(
      ofType(loadGame),
      mergeMap(({ gameId }) =>
        this.gamesService
          .fetchGame(gameId)
          .pipe(map(game => gameAdded({ game }))),
      ),
    );
  });

  loadActiveGame = createEffect(() => {
    /* if there is a game that I participate in, fetch it */
    return this.actions.pipe(
      ofType(profileLoaded),
      filter(
        ({ profile: theProfile }) =>
          Boolean(theProfile) && Boolean(theProfile.activeGameId),
      ),
      map(({ profile: theProfile }) =>
        loadGame({ gameId: theProfile.activeGameId }),
      ),
    );
  });

  loadRoutedGame = createEffect(() => {
    return this.actions.pipe(
      ofType(routerNavigatedAction),
      filter(({ payload }) => /^\/game\/.+$/.test(payload.routerState.url)),
      map(({ payload }) => payload.routerState.root.children[0].params.id),
      map(gameId => loadGame({ gameId })),
    );
  });

  ownGameStarted = createEffect(() => {
    return this.actions.pipe(
      ofType(gameCreated),
      concatLatestFrom(() => this.store.select(currentPlayer)),
      filter(
        ([{ game }, player]) =>
          player && Boolean(game.slots.find(s => s.player.id === player.id)),
      ),
      map(([{ game }]) => game.id),
      map(gameId => ownGameAdded({ gameId })),
    );
  });

  redirectToNewGame = createEffect(
    () => {
      /* when a game I am part of starts, redirect to its details page */
      return this.actions.pipe(
        ofType(ownGameAdded),
        map(({ gameId }) => this.router.navigate(['/game', gameId])),
      );
    },
    { dispatch: false },
  );

  forceEndGame = createEffect(
    () => {
      return this.actions.pipe(
        ofType(forceEndGame),
        mergeMap(({ gameId }) => this.gamesService.forceEndGame(gameId)),
      );
    },
    { dispatch: false },
  );

  reinitializeServer = createEffect(
    () => {
      return this.actions.pipe(
        ofType(reinitializeServer),
        mergeMap(({ gameId }) => this.gamesService.reinitializeServer(gameId)),
      );
    },
    { dispatch: false },
  );

  requestSubstitute = createEffect(
    () => {
      return this.actions.pipe(
        ofType(requestSubstitute),
        mergeMap(({ gameId, playerId }) =>
          this.gamesService.requestSubstitute(gameId, playerId),
        ),
      );
    },
    { dispatch: false },
  );

  cancelSubstitutionRequest = createEffect(
    () => {
      return this.actions.pipe(
        ofType(cancelSubstitutionRequest),
        mergeMap(({ gameId, playerId }) =>
          this.gamesService.cancelSubstitutionRequest(gameId, playerId),
        ),
      );
    },
    { dispatch: false },
  );

  constructor(
    private actions: Actions,
    private gamesService: GamesService,
    private store: Store,
    private router: Router,
    socket: Socket,
  ) {
    fromEvent<Game>(socket, 'game created').subscribe(game =>
      this.store.dispatch(gameCreated({ game })),
    );
    fromEvent<Game>(socket, 'game updated').subscribe(game =>
      this.store.dispatch(gameUpdated({ game })),
    );
  }
}
