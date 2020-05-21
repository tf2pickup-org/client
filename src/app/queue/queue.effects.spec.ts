import { TestBed } from '@angular/core/testing';
import { QueueEffects } from './queue.effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { ReplaySubject, of } from 'rxjs';
import { Action, MemoizedSelector } from '@ngrx/store';
import { QueueService } from './queue.service';
import { queueLoaded, loadQueue, joinQueue, joinQueueError, markFriend, mapVoteReset, voteForMap, mapVoted, mapVoteResultsUpdated,
  queueSlotsUpdated, hideReadyUpDialog, showReadyUpDialog, readyUp, queueStateUpdated, substituteRequestsUpdated, friendshipsUpdated } from './queue.actions';
import { Queue } from './models/queue';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { QueueSlot } from './models/queue-slot';
import { ownGameAdded } from '@app/games/games.actions';
import { MapVoteResult } from './models/map-vote-result';
import { AppState } from '@app/app.state';
import { mySlot, isPreReadied } from './queue.selectors';
import { PreReadyService } from './pre-ready.service';
import { Socket } from '@app/io/socket';
import { EventEmitter } from 'eventemitter3';

class PreReadyServiceStub {

}

const queue: Queue = {
  config: {
    teamCount: 2,
    classes: [
      {
        name: 'soldier',
        count: 1
      },
    ],
    nextMapSuccessfulVoteThreshold: 2,
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

const initialState = {
  profile: { id: 'FAKE_ID' },
  queue
};

describe('QueueEffects', () => {
  const actions = new ReplaySubject<Action>(1);
  let queueServiceStub: jasmine.SpyObj<QueueService>;
  let effects: QueueEffects;
  let store: MockStore<AppState>;

  beforeEach(() => {
    queueServiceStub = jasmine.createSpyObj<QueueService>('QueueService', [
      'fetchQueue',
      'joinQueue',
      'markFriend',
      'voteForMap',
    ]);
  });

  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      QueueEffects,
      provideMockActions(() => actions.asObservable()),
      { provide: QueueService, useValue: queueServiceStub },
      provideMockStore({ initialState }),
      { provide: PreReadyService, useClass: PreReadyServiceStub },
      { provide: Socket, useClass: EventEmitter },
    ],
  }));

  beforeEach(() => {
    effects = TestBed.inject(QueueEffects);
    store = TestBed.inject(MockStore);
  });

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
    it('should attempt to join the queue', () => {
      const slot: QueueSlot = { id: 1, gameClass: 'soldier', playerId: 'FAKE_ID_2', ready: false, };
      queueServiceStub.joinQueue.and.returnValue(of([ slot ]));
      effects.joinQueue.subscribe(action => expect(action).toEqual(queueSlotsUpdated({ slots: [ slot ] })));
      actions.next(joinQueue({ slotId: 1 }));
      expect(queueServiceStub.joinQueue).toHaveBeenCalledWith(1);
    });

    xit('should handle errors', done => {
      queueServiceStub.joinQueue.and.throwError('FAKE_ERROR');
      effects.joinQueue.subscribe(action => {
        expect(action).toEqual(joinQueueError({ error: 'FAKE_ERROR' }));
        done();
      });
      actions.next(joinQueue({ slotId: 1 }));
    });
  });

  describe('#showReadyUpDialog', () => {
    const slot: QueueSlot = { id: 1, gameClass: 'soldier', playerId: 'FAKE_ID_2', ready: false, };
    let mySlotSelector: MemoizedSelector<AppState, QueueSlot>;
    let preReadiedSelector: MemoizedSelector<AppState, boolean>;

    beforeEach(() => {
      mySlotSelector = store.overrideSelector(mySlot, slot);
      preReadiedSelector = store.overrideSelector(isPreReadied, false);
    });

    it('should show ready up dialog if the user is in the queue but not readied up', () => {
      effects.showReadyUpDialog.subscribe(action => expect(action).toEqual(showReadyUpDialog()));
      actions.next(queueLoaded({ queue: { ...queue, state: 'ready' }}));
    });

    it('should not show ready up dialog if the user is already readied up', () => {
      mySlotSelector.setResult({ ...slot, ready: true });
      effects.showReadyUpDialog.subscribe(() => fail());
      actions.next(queueLoaded({ queue: { ...queue, state: 'ready' }}));
      expect().nothing();
    });

    it('should ready up without showing the dialog if the user is pre-readied', () => {
      preReadiedSelector.setResult(true);
      effects.showReadyUpDialog.subscribe(action => expect(action).toEqual(readyUp()));
      actions.next(queueStateUpdated({ queueState: 'ready' }));
    });
  });

  describe('#closeReadyUpDialog', () => {
    it('should emit whenever user loses the slot', () => {
      const slot: QueueSlot = { id: 1, gameClass: 'soldier', playerId: 'FAKE_ID_2', ready: false, };
      const selector = store.overrideSelector(mySlot, slot);

      let n = 0;
      effects.closeReadyUpDialog.subscribe(action => {
        expect(action).toEqual(hideReadyUpDialog());
        n += 1;
        if (n > 1) {
          fail();
        }
      });

      selector.setResult(null);
      store.refreshState();
      expect().nothing();
    });
  });

  describe('#markFriend', () => {
    it('should call the service', () => {
      const friendships = [ { sourcePlayerId: 'FAKE_PLAYER_ID', targetPlayerId: 'FAKE_FRIEND_ID' } ];
      queueServiceStub.markFriend.and.returnValue(of(friendships));
      effects.markFriend.subscribe(action => expect(action).toEqual(friendshipsUpdated({ friendships })));
      actions.next(markFriend({ friendId: 'FAKE_FRIEND_ID' }));
      expect(queueServiceStub.markFriend).toHaveBeenCalledWith('FAKE_FRIEND_ID');
    });
  });

  describe('#voteForMap', () => {
    it('should attempt to vote for the given map', () => {
      queueServiceStub.voteForMap.and.returnValue(of('FAKE_MAP'));
      effects.voteForMap.subscribe(action => expect(action).toEqual(mapVoted({ map: 'FAKE_MAP' })));
      actions.next(voteForMap({ map: 'FAKE_MAP' }));
      expect(queueServiceStub.voteForMap).toHaveBeenCalledWith('FAKE_MAP');
    });
  });

  describe('#resetMapVote', () => {
    it('should reset map vote', () => {
      effects.resetMapVote.subscribe(action => expect(action).toEqual(mapVoteReset()));
      actions.next(ownGameAdded({ gameId: 'FAKE_GAME_ID' }));
    });
  });
});
