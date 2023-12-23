import { TestBed } from '@angular/core/testing';
import { QueueEffects } from './queue.effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { ReplaySubject, of, throwError } from 'rxjs';
import { Action, MemoizedSelector } from '@ngrx/store';
import { QueueService } from './queue.service';
import {
  queueLoaded,
  loadQueue,
  joinQueue,
  joinQueueError,
  markFriend,
  mapVoteReset,
  voteForMap,
  mapVoted,
  mapVoteResultsUpdated,
  queueSlotsUpdated,
  queueStateUpdated,
  substituteRequestsUpdated,
  friendshipsUpdated,
  scrambleMaps,
} from './queue.actions';
import { Queue } from './models/queue';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { QueueSlot } from './models/queue-slot';
import { MapVoteResult } from './models/map-vote-result';
import { AppState } from '@app/app.state';
import { Socket } from '@app/io/socket';
import { EventEmitter } from 'eventemitter3';
import { isInQueue } from './queue.selectors';
import { awaitsReadyUp } from '@app/selectors';
import { ReadyUpService } from './ready-up.service';
import { Tf2ClassName } from '@app/shared/models/tf2-class-name';
import { Player } from '@app/players/models/player';

const queue: Queue = {
  config: {
    teamCount: 2,
    classes: [
      {
        name: Tf2ClassName.soldier,
        count: 1,
      },
    ],
  },
  slots: [
    {
      id: 0,
      gameClass: Tf2ClassName.soldier,
      ready: false,
      player: { id: 'FAKE_ID' } as Player,
    },
    {
      id: 1,
      gameClass: Tf2ClassName.soldier,
      ready: false,
    },
  ],
  state: 'waiting',
  mapVoteResults: [],
  friendships: [],
};

describe('QueueEffects', () => {
  let actions: ReplaySubject<Action>;
  let queueServiceStub: jasmine.SpyObj<QueueService>;
  let readyUpService: jasmine.SpyObj<ReadyUpService>;
  let effects: QueueEffects;
  let store: MockStore<AppState>;
  let isInQueueSelector: MemoizedSelector<unknown, boolean>;

  beforeEach(() => {
    queueServiceStub = jasmine.createSpyObj<QueueService>(QueueService.name, [
      'fetchQueue',
      'joinQueue',
      'markFriend',
      'voteForMap',
      'scrambleMaps',
    ]);

    readyUpService = jasmine.createSpyObj<ReadyUpService>(ReadyUpService.name, [
      'askUserToReadyUp',
    ]);
  });

  beforeEach(() => (actions = new ReplaySubject<Action>(1)));

  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [
        QueueEffects,
        provideMockActions(() => actions.asObservable()),
        { provide: QueueService, useValue: queueServiceStub },
        provideMockStore(),
        { provide: Socket, useClass: EventEmitter },
        { provide: ReadyUpService, useValue: readyUpService },
      ],
    }),
  );

  beforeEach(() => {
    store = TestBed.inject(MockStore);
    isInQueueSelector = store.overrideSelector(isInQueue, false);
    store.overrideSelector(awaitsReadyUp, false);

    effects = TestBed.inject(QueueEffects);
  });

  afterEach(() => actions.complete());
  afterEach(() => TestBed.inject(MockStore)?.resetSelectors());

  it('should load the queue', () => {
    queueServiceStub.fetchQueue.and.returnValue(of(queue));
    effects.loadQueue.subscribe(action =>
      expect(action).toEqual(queueLoaded({ queue })),
    );
    actions.next(loadQueue());
    expect(queueServiceStub.fetchQueue).toHaveBeenCalled();
  });

  describe('when event happens', () => {
    const event = () => new EventEmitter();
    let socket: ReturnType<typeof event>;

    beforeEach(() => {
      socket = TestBed.inject(Socket) as unknown as typeof socket;
      spyOn(store, 'dispatch');
    });

    describe('queue slots update', () => {
      const slots: QueueSlot[] = [
        {
          id: 0,
          gameClass: Tf2ClassName.soldier,
          ready: false,
          player: { id: 'FAKE_ID_1' } as Player,
        },
        {
          id: 1,
          gameClass: Tf2ClassName.medic,
          ready: true,
          player: { id: 'FAKE_ID_2' } as Player,
        },
      ];

      beforeEach(() => {
        socket.emit('queue slots update', slots);
      });

      it('should be handled', () => {
        expect(store.dispatch).toHaveBeenCalledWith(
          queueSlotsUpdated({ slots }),
        );
      });
    });

    describe('queue state update', () => {
      beforeEach(() => {
        socket.emit('queue state update', 'waiting');
      });

      it('should be handled', () => {
        expect(store.dispatch).toHaveBeenCalledWith(
          queueStateUpdated({ queueState: 'waiting' }),
        );
      });
    });

    describe('map vote results update', () => {
      const results: MapVoteResult[] = [{ map: 'cp_fake_rc1', voteCount: 5 }];

      beforeEach(() => {
        socket.emit('map vote results update', results);
      });

      it('should be handled', () => {
        expect(store.dispatch).toHaveBeenCalledWith(
          mapVoteResultsUpdated({ results }),
        );
      });
    });

    describe('substitute requests update', () => {
      const substituteRequests = [
        {
          gameId: 'FAKE_GAME_ID',
          gameNumber: 515,
          gameClass: Tf2ClassName.soldier,
          team: 'BLU',
        },
      ];

      beforeEach(() => {
        socket.emit('substitute requests update', substituteRequests);
      });

      it('should be handled', () => {
        expect(store.dispatch).toHaveBeenCalledWith(
          substituteRequestsUpdated({ substituteRequests }),
        );
      });
    });

    describe('friendships update', () => {
      const friendships = [
        { sourcePlayerId: 'FAKE_SOURCE', targetPlayerId: 'FAKE_TARGET' },
      ];

      beforeEach(() => {
        socket.emit('friendships update', friendships);
      });

      it('should be handled', () => {
        expect(store.dispatch).toHaveBeenCalledWith(
          friendshipsUpdated({ friendships }),
        );
      });
    });
  });

  describe('#scrambleMaps', () => {
    const results = [
      {
        map: 'cp_process_final',
        voteCount: 0,
      },
      {
        map: 'cp_sunshine',
        voteCount: 0,
      },
      {
        map: 'cp_snakewater_final1',
        voteCount: 0,
      },
    ];

    it('should attempt to scramble maps', done => {
      queueServiceStub.scrambleMaps.and.returnValue(of(results));
      effects.scrambleMaps.subscribe(action => {
        expect(queueServiceStub.scrambleMaps).toHaveBeenCalled();
        expect(action).toEqual(mapVoteResultsUpdated({ results }));
        done();
      });
      actions.next(scrambleMaps());
    });
  });

  describe('#joinQueue', () => {
    it('should attempt to join the queue', done => {
      const slot: QueueSlot = {
        id: 1,
        gameClass: Tf2ClassName.soldier,
        player: { id: 'FAKE_ID_2' } as Player,
        ready: false,
      };
      queueServiceStub.joinQueue.and.returnValue(of([slot]));
      effects.joinQueue.subscribe(action => {
        expect(queueServiceStub.joinQueue).toHaveBeenCalledWith(1);
        expect(action).toEqual(queueSlotsUpdated({ slots: [slot] }));
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
      const friendships = [
        { sourcePlayerId: 'FAKE_PLAYER_ID', targetPlayerId: 'FAKE_FRIEND_ID' },
      ];
      queueServiceStub.markFriend.and.returnValue(of(friendships));
      effects.markFriend.subscribe(action => {
        expect(queueServiceStub.markFriend).toHaveBeenCalledWith(
          'FAKE_FRIEND_ID',
        );
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
});
