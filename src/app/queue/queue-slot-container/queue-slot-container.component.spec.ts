/* eslint-disable @typescript-eslint/naming-convention */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { QueueSlotContainerComponent } from './queue-slot-container.component';
import { MockComponent } from 'ng-mocks';
import { QueueSlotItemComponent } from '../queue-slot-item/queue-slot-item.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { Store } from '@ngrx/store';
import { joinQueue, markFriend } from '../queue.actions';
import { canJoinQueue } from '@app/selectors';
import { By } from '@angular/platform-browser';
import { merge, cloneDeep } from 'lodash-es';
import { ChangeDetectionStrategy } from '@angular/core';
import { Tf2ClassName } from '@app/shared/models/tf2-class-name';

const initialState = {
  players: {
    players: {
      ids: ['FAKE_SOLDIER_ID', 'FAKE_MEDIC_1_ID', 'FAKE_MEDIC_2_ID'],
      entities: {
        FAKE_SOLDIER_ID: {
          name: 'majiwem171',
          id: 'FAKE_SOLDIER_ID',
        },
        FAKE_MEDIC_1_ID: {
          name: 'maly',
          id: 'FAKE_MEDIC_1_ID',
        },
        FAKE_MEDIC_2_ID: {
          name: 'niewielki',
          id: 'FAKE_MEDIC_2_ID',
        },
      },
      locked: false,
    },
  },
  queue: {
    slots: [
      {
        id: 0,
        gameClass: Tf2ClassName.soldier,
        playerId: 'FAKE_SOLDIER_ID',
        ready: false,
      },
      {
        id: 1,
        gameClass: Tf2ClassName.soldier,
        playerId: null,
        ready: false,
      },
      {
        id: 2,
        gameClass: 'medic',
        playerId: 'FAKE_MEDIC_1_ID',
        ready: false,
        canMakeFriendsWith: [Tf2ClassName.soldier],
      },
      {
        id: 3,
        gameClass: 'medic',
        playerId: 'FAKE_MEDIC_2_ID',
        ready: false,
        canMakeFriendsWith: [Tf2ClassName.soldier],
      },
    ],
    friendships: [],
  },
  profile: {
    authenticated: 'authenticated',
    player: {
      name: 'maly',
      id: 'FAKE_MEDIC_1_ID',
      activeGameId: null,
    },
  },
};

describe('QueueSlotContainerComponent', () => {
  let component: QueueSlotContainerComponent;
  let fixture: ComponentFixture<QueueSlotContainerComponent>;
  let store: MockStore;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        QueueSlotContainerComponent,
        MockComponent(QueueSlotItemComponent),
      ],
      providers: [
        provideMockStore({
          initialState,
          selectors: [{ selector: canJoinQueue, value: true }],
        }),
      ],
    })
      // https://github.com/angular/angular/issues/12313
      .overrideComponent(QueueSlotContainerComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.get(Store);
    fixture = TestBed.createComponent(QueueSlotContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch a slot', () => {
    component.slotId = 2;
    component.slot.subscribe(slot =>
      expect(slot).toEqual({
        id: 2,
        gameClass: Tf2ClassName.medic,
        playerId: 'FAKE_MEDIC_1_ID',
        ready: false,
        canMakeFriendsWith: [Tf2ClassName.soldier],
      }),
    );
  });

  it('should render the slot item', () => {
    expect(
      fixture.debugElement.query(By.css('app-queue-slot-item'))
        .componentInstance,
    ).toBeTruthy();
  });

  describe('takenByMe', () => {
    it('should return true if this slot is in fact occupied by me', () => {
      component.slotId = 2;
      component.takenByMe.subscribe(value => expect(value).toBe(true));
    });

    it('should return false if this slot not occupied by me', () => {
      component.slotId = 1;
      component.takenByMe.subscribe(value => expect(value).toBe(false));
    });
  });

  describe('friendFlags', () => {
    it("should return canMarkAsFriend: false if I'm not a medic", () => {
      store.setState(
        merge(cloneDeep(initialState), {
          profile: {
            id: 'FAKE_SOLDIER_ID',
          },
        }),
      );

      component.slotId = 2;
      component.friendFlags.subscribe(value =>
        expect(value).toEqual({ canMarkAsFriend: false }),
      );
    });

    it('should return canMarkAsFriend: false if this slot is mine', () => {
      component.slotId = 2;
      component.friendFlags.subscribe(value =>
        expect(value).toEqual({ canMarkAsFriend: false }),
      );
    });

    it("should return canMarkAsFriend: false if this is the other medic's slot", () => {
      component.slotId = 3;
      component.friendFlags.subscribe(value =>
        expect(value).toEqual({ canMarkAsFriend: false }),
      );
    });

    it('should return canMarkAsFriend: true if the player on the slot can be marked as friend', () => {
      component.slotId = 0;
      component.friendFlags.subscribe(value =>
        expect(value).toEqual({ canMarkAsFriend: true }),
      );
    });

    it('should return markedByMe: true if the player on the slot is marked as friend by me', () => {
      store.setState(
        merge(cloneDeep(initialState), {
          queue: {
            friendships: [
              {
                sourcePlayerId: 'FAKE_MEDIC_1_ID',
                targetPlayerId: 'FAKE_SOLDIER_ID',
              },
            ],
          },
        }),
      );
      component.slotId = 0;
      component.friendFlags.subscribe(value =>
        expect(value).toEqual({ canMarkAsFriend: true, markedByMe: true }),
      );
    });

    it('should return markedBy if the player on the slot is marked as friend by another medic', () => {
      store.setState(
        merge(cloneDeep(initialState), {
          queue: {
            friendships: [
              {
                sourcePlayerId: 'FAKE_MEDIC_2_ID',
                targetPlayerId: 'FAKE_SOLDIER_ID',
              },
            ],
          },
        }),
      );
      component.slotId = 0;
      component.friendFlags.subscribe(value =>
        expect(value).toEqual({
          canMarkAsFriend: true,
          markedBy: {
            name: 'niewielki',
            id: 'FAKE_MEDIC_2_ID',
          },
        } as any),
      );
    });
  });

  it('should pass the correct locked value', () => {
    const queueSlotItem = fixture.debugElement.query(
      By.css('app-queue-slot-item'),
    ).componentInstance as QueueSlotItemComponent;
    expect(queueSlotItem.locked).toBe(false);
  });

  describe('#joinQueue()', () => {
    it('should dispatch the joinQueue action', () => {
      const spy = spyOn(store, 'dispatch');
      component.joinQueue({
        id: 0,
        gameClass: Tf2ClassName.soldier,
        ready: false,
      });
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
    it('should dispatch the markFriend action', () => {
      const spy = spyOn(store, 'dispatch');
      component.markFriend('FAKE_PLAYER_ID');
      expect(spy).toHaveBeenCalledWith(
        markFriend({ friendId: 'FAKE_PLAYER_ID' }),
      );
    });
  });
});
