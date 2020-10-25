import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { queueCurrentPlayerCount, queueRequiredPlayerCount, queueState, isQueueLoading, isInQueue } from '../queue.selectors';

@Component({
  selector: 'app-queue-status',
  templateUrl: './queue-status.component.html',
  styleUrls: ['./queue-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QueueStatusComponent {

  playerCount = this.store.select(queueCurrentPlayerCount);
  requiredPlayerCount = this.store.select(queueRequiredPlayerCount);
  state = this.store.select(queueState);
  loading = this.store.select(isQueueLoading);
  isInQueue = this.store.select(isInQueue);

  constructor(
    private store: Store,
  ) { }

}
