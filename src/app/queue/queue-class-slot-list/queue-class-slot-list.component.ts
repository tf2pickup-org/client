import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { QueueSlot } from '../models/queue-slot';
import { Store } from '@ngrx/store';
import { queueSlotsForClass } from '../queue.selectors';

@Component({
  selector: 'app-queue-class-slot-list',
  templateUrl: './queue-class-slot-list.component.html',
  styleUrls: ['./queue-class-slot-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QueueClassSlotListComponent {
  slots: Observable<QueueSlot[]>;

  @Input()
  set gameClass(gameClass: string) {
    this.slots = this.store.select(queueSlotsForClass(gameClass));
  }

  constructor(private store: Store) {}

  slotId(index: number, slot: QueueSlot) {
    return slot.id;
  }
}
