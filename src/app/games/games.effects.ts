import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { GamesService } from './games.service';
import { loadGames, gamesLoaded } from './games.actions';
import { mergeMap, map } from 'rxjs/operators';

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

  constructor(
    private actions: Actions,
    private gamesService: GamesService,
  ) { }

}
