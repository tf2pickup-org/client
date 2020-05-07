import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType, ROOT_EFFECTS_INIT, OnInitEffects } from '@ngrx/effects';
import { TwitchService } from './twitch.service';
import { mergeMap, map, tap } from 'rxjs/operators';
import { twitchStreamsLoaded, loadTwitchStreams } from './twitch.actions';

@Injectable()
export class TwitchEffects implements OnInitEffects {

  loadTwitchStreams = createEffect(() =>
    this.actions.pipe(
      ofType(loadTwitchStreams),
      tap(() => console.log('dupa')),
      mergeMap(() => this.twitchService.fetchStreams().pipe(
        map(twitchStreams => twitchStreamsLoaded({ twitchStreams })),
      )),
    )
  );

  constructor(
    private actions: Actions,
    private twitchService: TwitchService,
  ) { }

  ngrxOnInitEffects() {
    return loadTwitchStreams();
  }

}
