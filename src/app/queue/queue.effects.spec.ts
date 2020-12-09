import { TestBed } from '@angular/core/testing';
import { QueueEffects } from './queue.effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { ReplaySubject, of, throwError, NEVER } from 'rxjs';
import { Action, MemoizedSelector } from '@ngrx/store';
import { QueueService } from './queue.service';
import { queueLoaded, loadQueue, joinQueue, joinQueueError, markFriend, mapVoteReset, voteForMap, mapVoted, mapVoteResultsUpdated,
  queueSlotsUpdated, queueStateUpdated, substituteRequestsUpdated, friendshipsUpdated, readyUp, leaveQueue } from './queue.actions';
import { Queue } from './models/queue';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { QueueSlot } from './models/queue-slot';
import { MapVoteResult } from './models/map-vote-result';
import { AppState } from '@app/app.state';
import { Socket } from '@app/io/socket';
import { EventEmitter } from 'eventemitter3';
import { ReadyUpDialogService } from './ready-up-dialog.service';
import { isInQueue } from './queue.selectors';
import { isReadyUpDialogShown } from '@app/selectors';
import { QueueReadyUpAction } from './queue-ready-up-dialog/queue-ready-up-dialog.component';

const queue: Queue = {
  config: {
    teamCount: 2,
    classes: [
      {
        name: 'soldier',
        count: 1
      },
    ],
  },
  slots: [
    {
      id: 0,
      gameClass: 'soldier',
      ready: false,
      playerId: 'FAKE_ID',
    },
    {
      id: 1,
      gameClass: 'soldier',
      ready: false,
    }
  ],
  state: 'waiting',
  mapVoteResults: [],
  friendships: [],
};

describe('QueueEffects', () => {
  let actions: ReplaySubject<Action>;
  let queueServiceStub: jasmine.SpyObj<QueueService>;
  let readyUpDialogService: jasmine.SpyObj<ReadyUpDialogService>;
  let effects: QueueEffects;
  let store: MockStore<AppState>;
  let isInQueueSelector: MemoizedSelector<unknown, boolean>;
  let isReadyUpDialogShownSelector: MemoizedSelector<unknown, boolean>;

  beforeEach(() => {
    queueServiceStub = jasmine.createSpyObj<QueueService>(QueueService.name, [
      'fetchQueue',
      'joinQueue',
      'markFriend',
      'voteForMap',
    ]);

    readyUpDialogService = jasmine.createSpyObj<ReadyUpDialogService>(ReadyUpDialogService.name, ['showReadyUpDialog']);
  });

  beforeEach(() => actions = new ReplaySubject<Action>(1));

  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      QueueEffects,
      provideMockActions(() => actions.asObservable()),
      { provide: QueueService, useValue: queueServiceStub },
      provideMockStore(),
      { provide: Socket, useClass: EventEmitter },
      { provide: ReadyUpDialogService, useValue: readyUpDialogService },
    ],
  }));

  beforeEach(() => {
    store = TestBed.inject(MockStore);
    isInQueueSelector = store.overrideSelector(isInQueue, false);
    isReadyUpDialogShownSelector = store.overrideSelector(isReadyUpDialogShown, false);

    effects = TestBed.inject(QueueEffects);
  });

  afterEach(() => actions.complete());

  it('should load the queue', () => {
    queueServiceStub.fetchQueue.and.returnValue(of(queue));
    effects.loadQueue.subscribe(action => expect(action).toEqual(queueLoaded({ queue })));
    actions.next(loadQueue());
    expect(queueServiceStub.fetchQueue).toHaveBeenCalled();
  });

  it('should handle queue events', () => {
    const socket = TestBed.inject(Socket);
    const spy = spyOn(store, 'dispatch');

    const slots: QueueSlot[] = [
      { id: 0, gameClass: 'soldier', playerId: 'FAKE_ID_1', ready: false, },
      { id: 1, gameClass: 'medic', playerId: 'FAKE_ID_2', ready: true, }
    ];

    // @ts-ignore
    socket.emit('queue slots update', slots);
    expect(spy).toHaveBeenCalledWith(queueSlotsUpdated({ slots }));

    // @ts-ignore
    socket.emit('queue state update', 'waiting');
    expect(spy).toHaveBeenCalledWith(queueStateUpdated({ queueState: 'waiting' }));

    const results: MapVoteResult[] = [ { map: 'cp_fake_rc1', voteCount: 5 } ];
    // @ts-ignore
    socket.emit('map vote results update', results);
    expect(spy).toHaveBeenCalledWith(mapVoteResultsUpdated({ results }));

    const substituteRequests = [
      {
        gameId: 'FAKE_GAME_ID',
        gameNumber: 515,
        gameClass: 'soldier',
        team: 'BLU'
      }
    ];
    // @ts-ignore
    socket.emit('substitute requests update', substituteRequests);
    expect(spy).toHaveBeenCalledWith(substituteRequestsUpdated({ substituteRequests }));

    const friendships = [{ sourcePlayerId: 'FAKE_SOURCE', targetPlayerId: 'FAKE_TARGET' }];
    // @ts-ignore
    socket.emit('friendships update', friendships);
    expect(spy).toHaveBeenCalledWith(friendshipsUpdated({ friendships }));
  });

  describe('#joinQueue', () => {
    it('should attempt to join the queue', done => {
      const slot: QueueSlot = { id: 1, gameClass: 'soldier', playerId: 'FAKE_ID_2', ready: false, };
      queueServiceStub.joinQueue.and.returnValue(of([ slot ]));
      effects.joinQueue.subscribe(action => {
        expect(queueServiceStub.joinQueue).toHaveBeenCalledWith(1);
        expect(action).toEqual(queueSlotsUpdated({ slots: [ slot ] }));
        done();
      });
      actions.next(joinQueue({ slotId: 1 }));
    });

    it('should handle errors', done => {
      queueServiceStub.joinQueue.and.returnValue(throwError('FAKE_ERROR'));
      effects.joinQueue.subscribe(action => {
        expect(action).toEqual(joinQueueError({ error: 'FAKE_ERROR' }));
        done();
      });
      actions.next(joinQueue({ slotId: 1 }));
    });
  });

  describe('#markFriend', () => {
    it('should call the service', done => {
      const friendships = [ { sourcePlayerId: 'FAKE_PLAYER_ID', targetPlayerId: 'FAKE_FRIEND_ID' } ];
      queueServiceStub.markFriend.and.returnValue(of(friendships));
      effects.markFriend.subscribe(action => {
        expect(queueServiceStub.markFriend).toHaveBeenCalledWith('FAKE_FRIEND_ID');
        expect(action).toEqual(friendshipsUpdated({ friendships }));
        done();
      });
      actions.next(markFriend({ friendId: 'FAKE_FRIEND_ID' }));
    });
  });

  describe('#voteForMap', () => {
    it('should attempt to vote for the given map', done => {
      queueServiceStub.voteForMap.and.returnValue(of('FAKE_MAP'));
      effects.voteForMap.subscribe(action => {
        expect(queueServiceStub.voteForMap).toHaveBeenCalledWith('FAKE_MAP');
        expect(action).toEqual(mapVoted({ map: 'FAKE_MAP' }));
        done();
      });
      actions.next(voteForMap({ map: 'FAKE_MAP' }));
    });
  });

  describe('#resetMapVote', () => {
    it('should reset map vote', done => {
      effects.resetMapVote.subscribe(action => {
        expect(action).toEqual(mapVoteReset());
        done();
      });
      isInQueueSelector.setResult(false);
      store.refreshState();
    });
  });

  describe('when ready-up dialog needs to be shown', () => {
    beforeEach(() => {
      readyUpDialogService.showReadyUpDialog.and.returnValue(NEVER);
    });

    it('shows the ready-up dialog', () => {
      isReadyUpDialogShownSelector.setResult(true);
      store.refreshState();
      expect(readyUpDialogService.showReadyUpDialog).toHaveBeenCalledTimes(1);
    });

    describe('when user readies up', () => {
      beforeEach(() => {
        readyUpDialogService.showReadyUpDialog.and.returnValue(of(QueueReadyUpAction.readyUp));
      });

      it('should ready up', () => {
        const spy = spyOn(store, 'dispatch');

        isReadyUpDialogShownSelector.setResult(true);
        store.refreshState();

        expect(spy).toHaveBeenCalledWith(readyUp());
      });
    });

    describe('when user does not ready up', () => {
      beforeEach(() => {
        readyUpDialogService.showReadyUpDialog.and.returnValue(of(QueueReadyUpAction.leaveQueue));
      });

      it('should leave the queue', () => {
        const spy = spyOn(store, 'dispatch');

        isReadyUpDialogShownSelector.setResult(true);
        store.refreshState();

        expect(spy).toHaveBeenCalledWith(leaveQueue());
      });
    });
  });
});
