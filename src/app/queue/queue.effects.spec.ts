import { TestBed, async } from '@angular/core/testing';
import { QueueEffects } from './queue.effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { ReplaySubject, Subject, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { QueueEventsService } from './queue-events.service';
import { QueueService } from './queue.service';
import { queueLoaded, loadQueue, queueSlotUpdated, joinQueue, joinQueueError } from './queue.actions';
import { Queue } from './models/queue';
import { provideMockStore } from '@ngrx/store/testing';
import { QueueSlot } from './models/queue-slot';

class QueueServiceStub {
  fetchQueue() { }
  joinQueue(slotId: string) { }
}

class QueueEventsServiceStub {
  slotUpdate = new Subject<any>();
  stateUpdate = new Subject<any>();
  slotsReset = new Subject<any>();
  mapUpdate = new  Subject<any>();
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
      votesForMapChange: false,
    },
    {
      id: 1,
      gameClass: 'soldier',
      playerReady: false,
      votesForMapChange: false,
    }
  ],
  state: 'waiting',
  map: 'cp_badlands',
};

describe('QueueEffects', () => {
  const actions = new ReplaySubject<Action>(1);
  let queueService: QueueService;
  let effects: QueueEffects;

  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      QueueEffects,
      provideMockActions(() => actions.asObservable()),
      { provide: QueueService, useClass: QueueServiceStub },
      { provide: QueueEventsService, useClass: QueueEventsServiceStub },
      provideMockStore(),
    ],
  }));

  beforeEach(() => {
    queueService = TestBed.get(QueueService);
    effects = TestBed.get(QueueEffects);
  });

  it('should load the queue', () => {
    const spy = spyOn(queueService, 'fetchQueue').and.returnValue(of(queue));
    effects.loadQueue.subscribe(action => expect(action).toEqual(queueLoaded({ queue })));
    actions.next(loadQueue());
    expect(spy).toHaveBeenCalled();
  });

  describe('#joinQueue', () => {
    it('should attempt to join the queue', () => {
      const slot: QueueSlot = { id: 1, gameClass: 'soldier', playerId: 'FAKE_ID_2', playerReady: false, votesForMapChange: false, };
      const spy = spyOn(queueService, 'joinQueue').and.returnValue(of(slot));
      effects.joinQueue.subscribe(action => expect(action).toEqual(queueSlotUpdated({ slot })));
      actions.next(joinQueue({ slotId: 1 }));
      expect(spy).toHaveBeenCalled();
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
});
