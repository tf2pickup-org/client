import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { TwitchService } from './twitch.service';
import { mergeMap, map } from 'rxjs/operators';
import { twitchStreamsLoaded, loadTwitchStreams } from './twitch.actions';

@Injectable()
export class TwitchEffects implements OnInitEffects {
  loadTwitchStreams = createEffect(() => {
    return this.actions.pipe(
      ofType(loadTwitchStreams),
      mergeMap(() =>
        this.twitchService
          .fetchStreams()
          .pipe(map(twitchStreams => twitchStreamsLoaded({ twitchStreams }))),
      ),
    );
  });

  constructor(private actions: Actions, private twitchService: TwitchService) {}

  ngrxOnInitEffects() {
    return loadTwitchStreams();
  }
}
