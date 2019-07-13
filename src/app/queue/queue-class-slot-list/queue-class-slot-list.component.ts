import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { QueueSlot } from '../models/queue-slot';
import { Store, select } from '@ngrx/store';
import { AppState } from '@app/app.state';
import { queueSlotsForClass } from '../queue.selectors';
import { profile } from '@app/profile/profile.selectors';
import { map, startWith, filter } from 'rxjs/operators';

@Component({
  selector: 'app-queue-class-slot-list',
  templateUrl: './queue-class-slot-list.component.html',
  styleUrls: ['./queue-class-slot-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QueueClassSlotListComponent {

  currentPlayerId: string;
  slots: Observable<QueueSlot[]>;

  @Input()
  set gameClass(gameClass: string) {
    this.slots = this.store.select(queueSlotsForClass(gameClass));
  }

  constructor(
    private store: Store<AppState>,
  ) {
    this.store.pipe(
      select(profile),
      map(theProfile => theProfile ? theProfile.id : null),
    ).subscribe(id => this.currentPlayerId = id);
  }

}
