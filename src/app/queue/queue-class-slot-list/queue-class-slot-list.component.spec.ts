import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { QueueClassSlotListComponent } from './queue-class-slot-list.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { queueLocked } from '@app/selectors';
import { AppState } from '@app/app.state';
import { Store, MemoizedSelector } from '@ngrx/store';
import { joinQueue, markFriend } from '../queue.actions';
import { mySlot } from '../queue.selectors';
import { QueueSlot } from '../models/queue-slot';
import { pairwise, toArray, take } from 'rxjs/operators';

describe('QueueClassSlotListComponent', () => {
  let component: QueueClassSlotListComponent;
  let fixture: ComponentFixture<QueueClassSlotListComponent>;
  let store: MockStore<AppState>;
  let mySlotSelector: MemoizedSelector<AppState, any>;

  const initialState = {
    profile: { profile: { id: 'FAKE_ID' } },
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QueueClassSlotListComponent ],
      providers: [
        provideMockStore({
          initialState,
          selectors: [
            { selector: queueLocked, value: false },
          ],
        }),
      ],
      schemas: [ NO_ERRORS_SCHEMA ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.get(Store);
    mySlotSelector = store.overrideSelector(mySlot, null);
    fixture = TestBed.createComponent(QueueClassSlotListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reflect queue locked state', async(() => {
    component.locked.subscribe(value => expect(value).toBe(false));
  }));

  it('should have the correct isMedic value', () => {
    component.isMedic.pipe(
      take(3),
      toArray(),
    ).subscribe(value => expect(value).toEqual([false, false, true]));

    mySlotSelector.setResult({ gameClass: 'soldier' });
    store.refreshState();
    mySlotSelector.setResult({ gameClass: 'medic' });
    store.refreshState();
  });

  it('should have the correct friendId value', () => {
    component.friendId.pipe(
      take(2),
      toArray(),
    ).subscribe(value => expect(value).toEqual([null, 'FAKE_ID']));

    mySlotSelector.setResult({ friend: 'FAKE_ID' });
    store.refreshState();
  });

  describe('#ngOnInit()', () => {
    it('should retrieve currentPlayerId', () => {
      component.ngOnInit();
      expect(component.currentPlayerId).toEqual('FAKE_ID');
    });
  });

  describe('#joinQueue()', () => {
    it('should dispatch the joinQueue action', () => {
      const spy = spyOn(store, 'dispatch');
      component.joinQueue({ id: 0, gameClass: 'soldier', playerReady: false, votesForMapChange: false });
      expect(spy).toHaveBeenCalledWith(joinQueue({ slotId: 0 }));
    });
  });

  describe('#leaveQueue()', () => {
    it('should dispatch the leaveQueue action', () => {
      const spy = spyOn(store, 'dispatch');
      component.leaveQueue();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('#markFriend()', () => {
    it('shoudl dispatch the markFriend action', () => {
      const spy = spyOn(store, 'dispatch');
      component.markFriend('FAKE_PLAYER_ID');
      expect(spy).toHaveBeenCalledWith(markFriend({ friendId: 'FAKE_PLAYER_ID' }));
    });
  });
});
