import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { QueueSlot } from '../models/queue-slot';
import { Store } from '@ngrx/store';
import { AppState } from '@app/app.state';
import { joinQueue } from '../queue.actions';

@Component({
  selector: 'app-queue-slot-item',
  templateUrl: './queue-slot-item.component.html',
  styleUrls: ['./queue-slot-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QueueSlotItemComponent {

  @Input()
  slot: QueueSlot;

  constructor(
    private store: Store<AppState>,
  ) { }

  takeSlot() {
    this.store.dispatch(joinQueue({ slotId: this.slot.id }));
  }

}
