import { TestBed, async } from '@angular/core/testing';
import { QueueEffects } from './queue.effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { ReplaySubject, Subject, of } from 'rxjs';
import { Action, Store, select } from '@ngrx/store';
import { QueueEventsService } from './queue-events.service';
import { QueueService } from './queue.service';
import { queueLoaded, loadQueue, joinQueue, joinQueueError, markFriend, mapVoteReset, voteForMap, mapVoted, mapVoteResultsUpdated,
  queueSlotsUpdated, hideReadyUpDialog } from './queue.actions';
import { Queue } from './models/queue';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { QueueSlot } from './models/queue-slot';
import { ownGameAdded } from '@app/games/games.actions';
import { PreReadyCountdownService } from './pre-ready-countdown.service';
import { MapVoteResult } from './models/map-vote-result';
import { AppState } from '@app/app.state';
import { mySlot } from './queue.selectors';

class QueueServiceStub {
  fetchQueue() { }
  joinQueue(slotId: string) { }
  markFriend(friendId: string) { }
  voteForMap(map: string) { }
}

class QueueEventsServiceStub {
  slotsUpdate = new Subject<any>();
  stateUpdate = new Subject<any>();
  mapVoteResultsUpdate = new Subject<any>();
}

class PreReadyCountdownServiceStub {

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
      playerReady: false,
      playerId: 'FAKE_ID',
    },
    {
      id: 1,
      gameClass: 'soldier',
      playerReady: false,
    }
  ],
  state: 'waiting',
  mapVoteResults: [],
};

describe('QueueEffects', () => {
  const actions = new ReplaySubject<Action>(1);
  let queueService: QueueService;
  let effects: QueueEffects;
  let store: MockStore<AppState>;

  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      QueueEffects,
      provideMockActions(() => actions.asObservable()),
      { provide: QueueService, useClass: QueueServiceStub },
      { provide: QueueEventsService, useClass: QueueEventsServiceStub },
      provideMockStore({}),
      { provide: PreReadyCountdownService, useClass: PreReadyCountdownServiceStub },
    ],
  }));

  beforeEach(() => {
    queueService = TestBed.get(QueueService);
    effects = TestBed.get(QueueEffects);
    store = TestBed.get(Store);
  });

  it('should load the queue', () => {
    const spy = spyOn(queueService, 'fetchQueue').and.returnValue(of(queue));
    effects.loadQueue.subscribe(action => expect(action).toEqual(queueLoaded({ queue })));
    actions.next(loadQueue());
    expect(spy).toHaveBeenCalled();
  });

  it('should handle queue events', () => {
    const queueEvents = TestBed.get(QueueEventsService) as QueueEventsServiceStub;
    const spy = spyOn(store, 'dispatch');

    const slots: QueueSlot[] = [
      { id: 0, gameClass: 'soldier', playerId: 'FAKE_ID_1', playerReady: false, },
      { id: 1, gameClass: 'medic', playerId: 'FAKE_ID_2', playerReady: true, }
    ];
    queueEvents.slotsUpdate.next(slots);
    expect(spy).toHaveBeenCalledWith(queueSlotsUpdated({ slots }));

    const results: MapVoteResult[] = [ { map: 'cp_fake_rc1', voteCount: 5 } ];
    queueEvents.mapVoteResultsUpdate.next(results);
    expect(spy).toHaveBeenCalledWith(mapVoteResultsUpdated({ results }));
  });

  describe('#joinQueue', () => {
    it('should attempt to join the queue', () => {
      const slot: QueueSlot = { id: 1, gameClass: 'soldier', playerId: 'FAKE_ID_2', playerReady: false, };
      const spy = spyOn(queueService, 'joinQueue').and.returnValue(of([ slot ]));
      effects.joinQueue.subscribe(action => expect(action).toEqual(queueSlotsUpdated({ slots: [ slot ] })));
      actions.next(joinQueue({ slotId: 1 }));
      expect(spy).toHaveBeenCalledWith(1);
    });

    xit('should handle errors', async(done => {
      spyOn(queueService, 'joinQueue').and.throwError('FAKE_ERROR');
      effects.joinQueue.subscribe(action => {
        expect(action).toEqual(joinQueueError({ error: 'FAKE_ERROR' }));
        done();
      });
      actions.next(joinQueue({ slotId: 1 }));
    }));
  });

  describe('#closeReadyUpDialog', () => {
    it('should emit whenever user loses the slot', () => {
      let n = 0;
      effects.closeReadyUpDialog.subscribe(action => {
        expect(action).toEqual(hideReadyUpDialog());
        n += 1;
        if (n > 1) {
          fail();
        }
      });

      const slot: QueueSlot = { id: 1, gameClass: 'soldier', playerId: 'FAKE_ID_2', playerReady: false, };
      const selector = store.overrideSelector(mySlot, slot);
      selector.setResult(null);
      store.refreshState();
      expect().nothing();
    });
  });

  describe('#markFriend', () => {
    it('should call the service', () => {
      const slot: QueueSlot = { id: 1, gameClass: 'soldier', playerId: 'FAKE_ID_2', playerReady: false, friend: 'FAKE_FRIEND_ID' };
      const spy = spyOn(queueService, 'markFriend').and.returnValue(of(slot));
      effects.markFriend.subscribe(action => expect(action).toEqual(queueSlotsUpdated({ slots: [ slot ] })));
      actions.next(markFriend({ friendId: 'FAKE_FRIEND_ID' }));
      expect(spy).toHaveBeenCalledWith('FAKE_FRIEND_ID');
    });
  });

  describe('#voteForMap', () => {
    it('should attempt to vote for the given map', () => {
      const spy = spyOn(queueService, 'voteForMap').and.returnValue(of('FAKE_MAP'));
      effects.voteForMap.subscribe(action => expect(action).toEqual(mapVoted({ map: 'FAKE_MAP' })));
      actions.next(voteForMap({ map: 'FAKE_MAP' }));
      expect(spy).toHaveBeenCalledWith('FAKE_MAP');
    });
  });

  describe('#resetMapVote', () => {
    it('should reset map vote', () => {
      effects.resetMapVote.subscribe(action => expect(action).toEqual(mapVoteReset()));
      actions.next(ownGameAdded({ gameId: 'FAKE_GAME_ID' }));
    });
  });
});
