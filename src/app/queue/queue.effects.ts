import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { loadQueue, queueLoaded, joinQueue, queuePlayersRefreshed } from './queue.actions';
import { mergeMap, map } from 'rxjs/operators';
import { QueueService } from './queue.service';

@Injectable()
export class QueueEffects implements OnInitEffects {

  loadQueue = createEffect(() =>
    this.actions.pipe(
      ofType(loadQueue),
      mergeMap(() => this.queueService.fetchQueue()),
      map(queue => queueLoaded({ queue })),
    )
  );

  joinQueue = createEffect(() =>
    this.actions.pipe(
      ofType(joinQueue),
      mergeMap(({ slot }) => this.queueService.joinQueue(slot)),
      map(players => queuePlayersRefreshed({ players })),
    )
  );

  constructor(
    private actions: Actions,
    private queueService: QueueService,
  ) { }

  ngrxOnInitEffects() {
    return loadQueue();
  }

}
