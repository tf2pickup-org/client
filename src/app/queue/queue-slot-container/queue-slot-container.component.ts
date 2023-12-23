/* eslint-disable @typescript-eslint/member-ordering */
import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { ReplaySubject, combineLatest, of, Observable } from 'rxjs';
import { QueueSlot } from '../models/queue-slot';
import { Store } from '@ngrx/store';
import { slotById, mySlot, queueFriendships } from '../queue.selectors';
import { canJoinQueue } from '@app/selectors';
import { joinQueue, leaveQueue, markFriend } from '../queue.actions';
import { switchMap, map, shareReplay, filter } from 'rxjs/operators';
import { currentPlayer } from '@app/profile/profile.selectors';
import { FriendFlags } from '../friend-flags';

@Component({
  selector: 'app-queue-slot-container',
  templateUrl: './queue-slot-container.component.html',
  styleUrls: ['./queue-slot-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QueueSlotContainerComponent {
  private _slotId = new ReplaySubject<number>(1);

  slot = this._slotId.pipe(
    switchMap(slotId => this.store.select(slotById(slotId))),
    shareReplay(1),
  );

  takenByMe = combineLatest([this._slotId, this.store.select(mySlot)]).pipe(
    map(([slotId, slot]) => slotId === slot?.id),
  );

  canMarkAsFriend = combineLatest([this.store.select(mySlot), this.slot]).pipe(
    map(([_mySlot, thisSlot]) =>
      thisSlot
        ? _mySlot?.canMakeFriendsWith?.includes(thisSlot?.gameClass)
        : false,
    ),
  );

  friendFlags: Observable<FriendFlags> = combineLatest([
    this.store.select(currentPlayer),
    this.canMarkAsFriend,
    this.slot,
    this.store.select(queueFriendships),
  ]).pipe(
    switchMap(([player, canBefriend, theSlot, allFriendships]) => {
      if (!canBefriend) {
        return of({ canMarkAsFriend: false });
      }

      const friendship = allFriendships.find(
        f => f.targetPlayerId === theSlot?.player?.id,
      );
      if (friendship?.sourcePlayerId === player?.id) {
        return of({ canMarkAsFriend: true, markedByMe: true });
      } else if (friendship?.sourcePlayerId) {
        return of({
          canMarkAsFriend: true,
          markedBy: friendship.sourcePlayerId,
        });
      }

      return of({ canMarkAsFriend: true });
    }),
  );

  locked = this.slot.pipe(
    filter(slot => Boolean(slot)),
    map(slot => slot!.gameClass),
    switchMap(gameClass => this.store.select(canJoinQueue(gameClass))),
    map(canJoin => !canJoin),
  );

  // skipcq: JS-0041
  @Input()
  set slotId(slotId: number) {
    this._slotId.next(slotId);
  }

  constructor(private store: Store) {}

  joinQueue(slot: QueueSlot) {
    this.store.dispatch(joinQueue({ slotId: slot.id }));
  }

  leaveQueue() {
    this.store.dispatch(leaveQueue());
  }

  markFriend(playerId: string) {
    this.store.dispatch(markFriend({ friendId: playerId }));
  }
}
