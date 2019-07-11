import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { loadQueue, queueLoaded } from './queue.actions';
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

  constructor(
    private actions: Actions,
    private queueService: QueueService,
  ) { }

  ngrxOnInitEffects() {
    return loadQueue();
  }

}
