import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { loadQueue, queueLoaded, joinQueue, leaveQueue, queueStateUpdated, joinQueueError, leaveQueueError, readyUp, readyUpError,
  stopPreReady, voteForMap, mapVoteResultsUpdated, mapVoted, mapVoteReset, queueSlotsUpdated, markFriend, startPreReady,
  substituteRequestsUpdated, friendshipsUpdated } from './queue.actions';
import { mergeMap, map, catchError, filter, mapTo, distinctUntilChanged } from 'rxjs/operators';
import { QueueService } from './queue.service';
import { Store, select } from '@ngrx/store';
import { of, fromEvent } from 'rxjs';
import { isInQueue } from './queue.selectors';
import { ownGameAdded } from '@app/games/games.actions';
import { Socket } from '@app/io/socket';
import { QueueSlot } from './models/queue-slot';
import { QueueState } from './models/queue-state';
import { MapVoteResult } from './models/map-vote-result';
import { SubstituteRequest } from './models/substitute-request';
import { Friendship } from './models/friendship';
import { ioConnected } from '@app/io/io.actions';

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

  cancelPreReadyOnQueueLeave = createEffect(() =>
    this.store.select(isInQueue).pipe(
      filter(inQueue => !inQueue),
      mapTo(stopPreReady()),
    )
  );

  cancelPreReadyOnGameLaunch = createEffect(() =>
    this.actions.pipe(
      ofType(ownGameAdded),
      mapTo(stopPreReady()),
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
      select(isInQueue),
      filter(inQueue => !inQueue),
      distinctUntilChanged(),
      mapTo(mapVoteReset()),
    )
  );

  constructor(
    private actions: Actions,
    private queueService: QueueService,
    private store: Store,
    socket: Socket,
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
