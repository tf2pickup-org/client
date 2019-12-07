import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { loadQueue, queueLoaded, joinQueue, leaveQueue, queueStateUpdated, joinQueueError, leaveQueueError, readyUp, readyUpError,
  showReadyUpDialog, hideReadyUpDialog, stopPreReady, voteForMap, mapVoteResultsUpdated, mapVoted,
  mapVoteReset, queueSlotsUpdated, markFriend, startPreReady } from './queue.actions';
import { mergeMap, map, catchError, filter, withLatestFrom, mapTo, tap } from 'rxjs/operators';
import { QueueService } from './queue.service';
import { QueueEventsService } from './queue-events.service';
import { Store, select } from '@ngrx/store';
import { AppState } from '@app/app.state';
import { of } from 'rxjs';
import { mySlot, isInQueue, isPreReadied } from './queue.selectors';
import { ownGameAdded } from '@app/games/games.actions';

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
        map(slots => queueSlotsUpdated({ slots })),
        catchError(error => of(joinQueueError({ error }))),
      )),
    )
  );

  leaveQueue = createEffect(() =>
    this.actions.pipe(
      ofType(leaveQueue),
      mergeMap(() => this.queueService.leaveQueue().pipe(
        map(slot => queueSlotsUpdated({ slots: [ slot ] })),
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
      withLatestFrom(this.store.select(isPreReadied)),
      map(([, preReadied]) => preReadied),
      map(preReadied => preReadied ? readyUp() : showReadyUpDialog()),
    )
  );

  readyUp = createEffect(() =>
    this.actions.pipe(
      ofType(readyUp),
      mergeMap(() => this.queueService.readyUp().pipe(
        map(slot => queueSlotsUpdated({ slots: [ slot ] })),
        catchError(error => of(readyUpError({ error }))),
      )),
    )
  );

  autoPreReady = createEffect(() =>
    this.actions.pipe(
      ofType(readyUp),
      mapTo(startPreReady()),
    )
  );

  closeReadyUpDialog = createEffect(() =>
    this.store.pipe(
      select(mySlot),
      filter(slot => !slot),
      map(() => hideReadyUpDialog()),
    )
  );

  cancelPreReadyOnQueueLeave = createEffect(() =>
    this.store.select(isInQueue).pipe(
      filter(inQueue => !inQueue),
      map(() => stopPreReady()),
    )
  );

  cancelPreReadyOnGameLaunch = createEffect(() =>
    this.actions.pipe(
      ofType(ownGameAdded),
      map(() => stopPreReady()),
    )
  );

  markFriend = createEffect(() =>
    this.actions.pipe(
      ofType(markFriend),
      mergeMap(({ friendId }) => this.queueService.markFriend(friendId).pipe(
        map(slot => queueSlotsUpdated({ slots: [ slot ] })),
      ))
    )
  );

  voteForMap = createEffect(() =>
    this.actions.pipe(
      ofType(voteForMap),
      mergeMap(({ map: aMap }) => this.queueService.voteForMap(aMap).pipe(
        map(theMap => mapVoted({ map: theMap })),
      )),
    )
  );

  resetMapVote = createEffect(() =>
    this.store.pipe(
      select(mySlot),
      filter(slot => !slot),
      mapTo(mapVoteReset()),
    )
  );

  constructor(
    private actions: Actions,
    private queueService: QueueService,
    private queueEventsService: QueueEventsService,
    private store: Store<AppState>,
  ) {
    this.queueEventsService.slotsUpdate.subscribe(slots => this.store.dispatch(queueSlotsUpdated({ slots })));
    this.queueEventsService.stateUpdate.subscribe(queueState => this.store.dispatch(queueStateUpdated({ queueState })));
    this.queueEventsService.mapVoteResultsUpdate.subscribe(results => this.store.dispatch(mapVoteResultsUpdated({ results })));
  }

}
