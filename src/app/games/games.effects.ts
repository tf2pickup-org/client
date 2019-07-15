import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { GamesService } from './games.service';
import { loadGames, gamesLoaded, gameAdded, loadGame } from './games.actions';
import { mergeMap, map } from 'rxjs/operators';
import { GamesEventsService } from './games-events.service';
import { Store } from '@ngrx/store';
import { AppState } from '@app/app.state';

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

  constructor(
    private actions: Actions,
    private gamesService: GamesService,
    private gamesEventsService: GamesEventsService,
    private store: Store<AppState>,
  ) {
    this.gamesEventsService.gameCreated.subscribe(game => this.store.dispatch(gameAdded({ game })));
  }

}
