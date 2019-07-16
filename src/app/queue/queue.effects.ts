import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { loadQueue, queueLoaded, joinQueue, leaveQueue, queueSlotUpdated, queueStateUpdated, joinQueueError,
    leaveQueueError, readyUp, readyUpError, queueSlotsRefreshed, queueMapUpdated} from './queue.actions';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { QueueService } from './queue.service';
import { QueueEventsService } from './queue-events.service';
import { Store } from '@ngrx/store';
import { AppState } from '@app/app.state';
import { of } from 'rxjs';

@Injectable()
export class QueueEffects {

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
      mergeMap(({ slotId }) => this.queueService.joinQueue(slotId).pipe(
        map(slot => queueSlotUpdated({ slot })),
        catchError(error => of(joinQueueError({ error }))),
      )),
    )
  );

  leaveQueue = createEffect(() =>
    this.actions.pipe(
      ofType(leaveQueue),
      mergeMap(() => this.queueService.leaveQueue().pipe(
        map(slot => queueSlotUpdated({ slot })),
        catchError(error => of(leaveQueueError({ error }))),
      )),
    )
  );

  readyUp = createEffect(() =>
    this.actions.pipe(
      ofType(readyUp),
      mergeMap(() => this.queueService.readyUp().pipe(
        map(slot => queueSlotUpdated({ slot })),
        catchError(error => of(readyUpError({ error }))),
      )),
    )
  );

  constructor(
    private actions: Actions,
    private queueService: QueueService,
    private queueEventsService: QueueEventsService,
    private store: Store<AppState>,
  ) {
    this.queueEventsService.slotUpdate.subscribe(slot => this.store.dispatch(queueSlotUpdated({ slot })));
    this.queueEventsService.stateUpdate.subscribe(queueState => this.store.dispatch(queueStateUpdated({ queueState })));
    this.queueEventsService.slotsReset.subscribe(slots => this.store.dispatch(queueSlotsRefreshed({ slots })));
    this.queueEventsService.mapUpdate.subscribe(queueMap => this.store.dispatch(queueMapUpdated({ map: queueMap })));
  }

}
