import { Component, Input, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { QueueSlot } from '../models/queue-slot';
import { Store, select } from '@ngrx/store';
import { AppState } from '@app/app.state';
import { queueSlotsForClass, queueLocked } from '../queue.selectors';
import { profile } from '@app/profile/profile.selectors';
import { takeUntil } from 'rxjs/operators';

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

}
