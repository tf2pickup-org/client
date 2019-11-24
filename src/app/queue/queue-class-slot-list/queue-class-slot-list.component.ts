import { Component, Input, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { QueueSlot } from '../models/queue-slot';
import { Store, select } from '@ngrx/store';
import { AppState } from '@app/app.state';
import { queueSlotsForClass, mySlot } from '../queue.selectors';
import { profile } from '@app/profile/profile.selectors';
import { takeUntil, map } from 'rxjs/operators';
import { queueLocked } from '@app/selectors';
import { joinQueue, leaveQueue, markFriend } from '../queue.actions';

@Component({
  selector: 'app-queue-class-slot-list',
  templateUrl: './queue-class-slot-list.component.html',
  styleUrls: ['./queue-class-slot-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QueueClassSlotListComponent implements OnInit, OnDestroy {

  private destroyed = new Subject<void>();
  currentPlayerId: string;
  slots: Observable<QueueSlot[]>;
  locked: Observable<boolean> = this.store.select(queueLocked);
  isMedic: Observable<boolean> = this.store.pipe(
    select(mySlot),
    map(slot => slot && slot.gameClass === 'medic'),
  );
  friendId: Observable<string> = this.store.pipe(
    select(mySlot),
    map(slot => slot && slot.friend),
  );

  @Input()
  set gameClass(gameClass: string) {
    this.slots = this.store.select(queueSlotsForClass(gameClass));
  }

  constructor(
    private store: Store<AppState>,
  ) { }

  ngOnInit() {
    this.store.pipe(
      select(profile),
      takeUntil(this.destroyed),
    ).subscribe(theProfile => {
      if (theProfile) {
        this.currentPlayerId = theProfile.id;
      }
    });
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.unsubscribe();
  }

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
