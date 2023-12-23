import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { QueueSlot } from '../models/queue-slot';
import { FriendFlags } from '../friend-flags';

@Component({
  selector: 'app-queue-slot-item',
  templateUrl: './queue-slot-item.component.html',
  styleUrls: ['./queue-slot-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QueueSlotItemComponent {
  @Input({ required: true })
  slot!: QueueSlot;

  @Input()
  locked = true;

  @Input()
  takenByMe = false;

  @Input()
  friendFlags: FriendFlags = { canMarkAsFriend: false };

  @Output()
  takeSlot = new EventEmitter<QueueSlot>();

  @Output()
  freeSlot = new EventEmitter<void>();

  @Output()
  markFriend = new EventEmitter<string | null>();

  maybeTakeSlot() {
    if (!this.locked && !this.slot?.player && !this.takenByMe) {
      this.takeSlot.emit(this.slot);
    }
  }

  emitFreeSlot(event: Event) {
    this.freeSlot.emit();
    event.stopPropagation();
  }

  emitMarkFriend(friendId: string, event: Event) {
    this.markFriend.emit(this.friendFlags.markedByMe ? null : friendId);
    event.stopPropagation();
  }
}
