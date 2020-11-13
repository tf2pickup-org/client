import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { loadQueue, queueLoaded, joinQueue, leaveQueue, queueStateUpdated, joinQueueError, leaveQueueError, readyUp, readyUpError,
  showReadyUpDialog, hideReadyUpDialog, stopPreReady, voteForMap, mapVoteResultsUpdated, mapVoted,
  mapVoteReset, queueSlotsUpdated, markFriend, startPreReady, substituteRequestsUpdated, friendshipsUpdated } from './queue.actions';
import { mergeMap, map, catchError, filter, withLatestFrom, mapTo, switchMap } from 'rxjs/operators';
import { QueueService } from './queue.service';
import { Store, select } from '@ngrx/store';
import { of, fromEvent } from 'rxjs';
import { mySlot, isInQueue, isPreReadied } from './queue.selectors';
import { ownGameAdded } from '@app/games/games.actions';
import { Socket } from '@app/io/socket';
import { QueueSlot } from './models/queue-slot';
import { QueueState } from './models/queue-state';
import { MapVoteResult } from './models/map-vote-result';
import { SubstituteRequest } from './models/substitute-request';
import { Friendship } from './models/friendship';
import { ioConnected } from '@app/io/io.actions';
import { ReadyUpDialogService } from './ready-up-dialog.service';

@Injectable()
export class QueueEffects {

  loadQueueWhenOnline = createEffect(() =>
    this.actions.pipe(
      ofType(ioConnected),
      mapTo(loadQueue()),
    )
  );

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
        catchError((error: unknown) => of(joinQueueError({ error: error as string }))),
      )),
    )
  );

  leaveQueue = createEffect(() =>
    this.actions.pipe(
      ofType(leaveQueue),
      mergeMap(() => this.queueService.leaveQueue().pipe(
        map(slot => queueSlotsUpdated({ slots: [ slot ] })),
        catchError((error: unknown) => of(leaveQueueError({ error: error as string }))),
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
      filter(([, slot]) => slot && !slot.ready),
      withLatestFrom(this.store.select(isPreReadied)),
      map(([, preReadied]) => preReadied),
      switchMap(preReadied => {
        if (preReadied) {
          return of(readyUp());
        }

        return this.readyUpDialogService.showReadyUpDialog().pipe(
          map(result => result ? readyUp() : leaveQueue()),
        );
      }),
    )
  );

  readyUp = createEffect(() =>
    this.actions.pipe(
      ofType(readyUp),
      mergeMap(() => this.queueService.readyUp().pipe(
        map(slot => queueSlotsUpdated({ slots: [ slot ] })),
        catchError((error: unknown) => of(readyUpError({ error: error as string }))),
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
        map(friendships => friendshipsUpdated({ friendships })),
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
    private store: Store,
    socket: Socket,
    private readyUpDialogService: ReadyUpDialogService,
  ) {
    fromEvent<QueueSlot[]>(socket, 'queue slots update')
      .subscribe(slots => this.store.dispatch(queueSlotsUpdated({ slots })));
    fromEvent<QueueState>(socket, 'queue state update')
      .subscribe(queueState => this.store.dispatch(queueStateUpdated({ queueState })));
    fromEvent<MapVoteResult[]>(socket, 'map vote results update')
      .subscribe(results => this.store.dispatch(mapVoteResultsUpdated({ results })));
    fromEvent<SubstituteRequest[]>(socket, 'substitute requests update')
      .subscribe(substituteRequests => this.store.dispatch(substituteRequestsUpdated({ substituteRequests })));
    fromEvent<Friendship[]>(socket, 'friendships update')
      .subscribe(friendships => this.store.dispatch(friendshipsUpdated({ friendships })));
  }

}
