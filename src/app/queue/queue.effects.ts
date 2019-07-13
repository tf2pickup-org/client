import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { loadQueue, queueLoaded, joinQueue, queueSlotsRefreshed, leaveQueue } from './queue.actions';
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
      mergeMap(({ slotId }) => this.queueService.joinQueue(slotId)),
      map(slots => queueSlotsRefreshed({ slots })),
    )
  );

  leaveQueue = createEffect(() =>
    this.actions.pipe(
      ofType(leaveQueue),
      mergeMap(() => this.queueService.leaveQueue()),
      map(slots => queueSlotsRefreshed({ slots })),
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
