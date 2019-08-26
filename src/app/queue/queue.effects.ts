import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { loadQueue, queueLoaded, joinQueue, leaveQueue, queueSlotUpdated, queueStateUpdated, joinQueueError,
    leaveQueueError, readyUp, readyUpError, queueSlotsRefreshed, queueMapUpdated, showReadyUpDialog,
    hideReadyUpDialog,
    togglePreReady,
    preReadyTimeoutReset,
    preReadyTimeoutCountDown} from './queue.actions';
import { mergeMap, map, catchError, filter, withLatestFrom, switchMap, mapTo, takeUntil, tap } from 'rxjs/operators';
import { QueueService } from './queue.service';
import { QueueEventsService } from './queue-events.service';
import { Store } from '@ngrx/store';
import { AppState } from '@app/app.state';
import { of, timer } from 'rxjs';
import { mySlot, votesForMapChange, isInQueue, isPreReadied, preReadyTimeout } from './queue.selectors';
import { PreReadyCountdownService } from './pre-ready-countdown.service';

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

  showReadyUpDialog = createEffect(() =>
    this.actions.pipe(
      ofType(queueStateUpdated, queueLoaded),
      map(action => {
        switch (action.type) {
          case queueStateUpdated.type:
            return action.queueState;
          case queueLoaded.type:
            return action.queue.state;
        }
      }),
      filter(queueState => queueState === 'ready'),
      withLatestFrom(this.store.select(mySlot)),
      filter(([, slot]) => slot && !slot.playerReady),
      map(() => showReadyUpDialog()),
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

  closeReadyUpDialog = createEffect(() =>
    this.actions.pipe(
      ofType(queueStateUpdated),
      filter(({ queueState }) => queueState === 'waiting'),
      withLatestFrom(this.store.select(mySlot)),
      filter(([, slot]) => !slot || !slot.playerReady),
      map(() => hideReadyUpDialog()),
    )
  );

  voteForMapChange = createEffect(() =>
    this.store.select(votesForMapChange).pipe(
      withLatestFrom(this.store.select(isInQueue)),
      filter(([, _isInQueue]) => _isInQueue),
      mergeMap(([value]) => this.queueService.voteForMapChange(value).pipe(
        map(slot => queueSlotUpdated({ slot })),
      ))
    )
  );

  resetPreReadyCountdown = createEffect(() =>
    this.actions.pipe(
      ofType(togglePreReady),
      map(() => preReadyTimeoutReset()),
    )
  );

  startPreReadyCounting = createEffect(() =>
    this.store.select(isPreReadied).pipe(
      filter(preReadied => preReadied),
      tap(() => this.preReadyCountdownService.start()),
    ), { dispatch: false },
  );

  stopPreReadyCounting = createEffect(() =>
    this.store.select(isPreReadied).pipe(
      filter(preReadied => !preReadied),
      tap(() => this.preReadyCountdownService.stop()),
    ), { dispatch: false },
  );

  preReadyTimeout = createEffect(() =>
    this.store.select(preReadyTimeout).pipe(
      filter(value => value <= 1),
      mapTo(togglePreReady()),
    )
  );

  constructor(
    private actions: Actions,
    private queueService: QueueService,
    private queueEventsService: QueueEventsService,
    private store: Store<AppState>,
    private preReadyCountdownService: PreReadyCountdownService,
  ) {
    this.queueEventsService.slotUpdate.subscribe(slot => this.store.dispatch(queueSlotUpdated({ slot })));
    this.queueEventsService.stateUpdate.subscribe(queueState => this.store.dispatch(queueStateUpdated({ queueState })));
    this.queueEventsService.slotsReset.subscribe(slots => this.store.dispatch(queueSlotsRefreshed({ slots })));
    this.queueEventsService.mapUpdate.subscribe(queueMap => this.store.dispatch(queueMapUpdated({ map: queueMap })));
  }

}
