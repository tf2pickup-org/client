import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { GamesService } from './games.service';
import { gameAdded, loadGame, gameUpdated, forceEndGame, gameCreated, reinitializeServer, ownGameAdded, requestSubsituteToggle,
  requestSubstitute, cancelSubstitutionRequest, replacePlayer } from './games.actions';
import { mergeMap, map, filter, withLatestFrom, first } from 'rxjs/operators';
import { GamesEventsService } from './games-events.service';
import { Store, select } from '@ngrx/store';
import { AppState } from '@app/app.state';
import { profile } from '@app/profile/profile.selectors';
import { profileLoaded } from '@app/profile/profile.actions';
import { Router } from '@angular/router';
import { playerSlot } from './games.selectors';

@Injectable()
export class GamesEffects {

  loadGame = createEffect(() =>
    this.actions.pipe(
      ofType(loadGame),
      mergeMap(({ gameId }) => this.gamesService.fetchGame(gameId).pipe(
        map(game => gameAdded({ game })),
      ))
    )
  );

  loadActiveGame = createEffect(() =>
    /* if there is a game that I participate in, fetch it */
    this.actions.pipe(
      ofType(profileLoaded),
      filter(({ profile: theProfile }) => !!theProfile && !!theProfile.activeGameId),
      map(({ profile: theProfile }) => loadGame({ gameId: theProfile.activeGameId })),
    )
  );

  ownGameStarted = createEffect(() =>
    this.actions.pipe(
      ofType(gameCreated),
      withLatestFrom(this.store.select(profile)),
      filter(([{ game }, theProfile]) => theProfile && game.players.includes(theProfile.id)),
      map(([{ game }]) => game.id),
      map(gameId => ownGameAdded({ gameId })),
    )
  );

  redirectToNewGame = createEffect(() =>
    /* when a game I am part of starts, redirect to its details page */
    this.actions.pipe(
      ofType(ownGameAdded),
      map(({ gameId }) => this.router.navigate(['/game', gameId])),
    ), { dispatch: false }
  );

  forceEndGame = createEffect(() =>
    this.actions.pipe(
      ofType(forceEndGame),
      mergeMap(({ gameId }) => this.gamesService.forceEndGame(gameId)),
    ),
    { dispatch: false },
  );

  reinitializeServer = createEffect(() =>
    this.actions.pipe(
      ofType(reinitializeServer),
      mergeMap(({ gameId }) => this.gamesService.reinitializeServer(gameId)),
    ),
    { dispatch: false },
  );

  requestSubsituteToggle = createEffect(() =>
    this.actions.pipe(
      ofType(requestSubsituteToggle),
      mergeMap(({ gameId, playerId }) => this.store.pipe(
        first(),
        select(playerSlot(gameId, playerId)),
        map(slot =>  {
          switch (slot.status) {
            case 'active':
              return requestSubstitute({ gameId, playerId });
            case 'waiting for substitute':
              return cancelSubstitutionRequest({ gameId, playerId });
            case 'replaced':
              throw new Error('cannot be');
          }
        }),
      )),
    )
  );

  requestSubstitute = createEffect(() =>
    this.actions.pipe(
      ofType(requestSubstitute),
      mergeMap(({ gameId, playerId }) => this.gamesService.requestSubstitute(gameId, playerId)),
    ), { dispatch: false },
  );

  cancelSubstitutionRequest = createEffect(() =>
    this.actions.pipe(
      ofType(cancelSubstitutionRequest),
      mergeMap(({ gameId, playerId }) => this.gamesService.cancelSubstitutionRequest(gameId, playerId)),
    ), { dispatch: false },
  );

  replacePlayer = createEffect(() =>
    this.actions.pipe(
      ofType(replacePlayer),
      mergeMap(({ gameId, replaceeId, replacementId }) => this.gamesService.replacePlayer(gameId, replaceeId, replacementId)),
    ), { dispatch: false },
  );

  constructor(
    private actions: Actions,
    private gamesService: GamesService,
    private gamesEventsService: GamesEventsService,
    private store: Store<{}>,
    private router: Router,
  ) {
    this.gamesEventsService.gameCreated.subscribe(game => this.store.dispatch(gameCreated({ game })));
    this.gamesEventsService.gameUpdated.subscribe(game => this.store.dispatch(gameUpdated({ game })));
  }

}
