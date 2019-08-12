import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { GamesService } from './games.service';
import { loadGames, gamesLoaded, gameAdded, loadGame, gameUpdated, forceEndGame, gameCreated } from './games.actions';
import { mergeMap, map, filter, mapTo, withLatestFrom } from 'rxjs/operators';
import { GamesEventsService } from './games-events.service';
import { Store } from '@ngrx/store';
import { AppState } from '@app/app.state';
import { combineLatest } from 'rxjs';
import { profile } from '@app/profile/profile.selectors';
import { queueLocked, queueUnlocked } from '@app/queue/queue.actions';
import { profileLoaded } from '@app/profile/profile.actions';
import { Router } from '@angular/router';

@Injectable()
export class GamesEffects {

  loadGames = createEffect(() =>
    this.actions.pipe(
      ofType(loadGames),
      mergeMap(() => this.gamesService.fetchGames().pipe(
        map(games => gamesLoaded({ games })),
      )),
    )
  );

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

  redirectToNewGame = createEffect(() =>
    /* when a game I am part of starts, redirect to its details page */
    this.actions.pipe(
      ofType(gameCreated),
      withLatestFrom(this.store.select(profile)),
      filter(([{ game }, theProfile]) => theProfile && game.players.includes(theProfile.id)),
      map(([{ game }]) => this.router.navigate(['/game', game.id])),
    ), { dispatch: false }
  );

  lockQueue = createEffect(() =>
    /* lock the queue when a game that I participate in starts */
    combineLatest([
      this.store.select(profile),
      this.actions.pipe(ofType(gameCreated)),
    ]).pipe(
      filter(([theProfile, { game }]) => game.players.includes(theProfile.id)),
      mapTo(queueLocked()),
    )
  );

  unlockQueue = createEffect(() =>
    /* unlock the queue when a game that I participated in ends */
    combineLatest([
      this.store.select(profile),
      this.actions.pipe(ofType(gameUpdated)),
    ]).pipe(
      filter(([theProfile, { game }]) => theProfile && game.players.includes(theProfile.id)),
      map(([, { game }]) => game),
      filter(game => game.state === 'ended' || game.state === 'interrupted'),
      mapTo(queueUnlocked()),
    )
  );

  forceEndGame = createEffect(() =>
    this.actions.pipe(
      ofType(forceEndGame),
      mergeMap(({ gameId }) => this.gamesService.forceEndGame(gameId)),
    ),
    { dispatch: false },
  );

  constructor(
    private actions: Actions,
    private gamesService: GamesService,
    private gamesEventsService: GamesEventsService,
    private store: Store<AppState>,
    private router: Router,
  ) {
    this.gamesEventsService.gameCreated.subscribe(game => this.store.dispatch(gameCreated({ game })));
    this.gamesEventsService.gameUpdated.subscribe(game => this.store.dispatch(gameUpdated({ game })));
  }

}
