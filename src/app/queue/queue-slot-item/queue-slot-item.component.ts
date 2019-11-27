import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { QueueSlot } from '../models/queue-slot';

@Component({
  selector: 'app-queue-slot-item',
  templateUrl: './queue-slot-item.component.html',
  styleUrls: ['./queue-slot-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QueueSlotItemComponent {

  @Input()
  slot: QueueSlot;

  @Input()
  takenByMe = false;

  @Input()
  locked = false;

  @Input()
  canHaveFriend = false;

  @Input()
  isFriend = false;

  @Output()
  takeSlot = new EventEmitter<QueueSlot>();

  @Output()
  freeSlot = new EventEmitter<void>();

  @Output()
  markFriend = new EventEmitter<string>();

  emitFreeSlot(event: Event) {
    this.freeSlot.emit();
    event.stopPropagation();
  }

  emitMarkFriend(friendId: string, event: Event) {
    this.markFriend.emit(this.isFriend ? null : friendId);
    event.stopPropagation();
  }

}
