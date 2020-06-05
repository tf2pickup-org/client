import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { queueCurrentPlayerCount, queueRequiredPlayerCount, queueState, isQueueLoading } from '../queue.selectors';
import { trigger } from '@angular/animations';
import { fadeIn } from '@app/animations';

@Component({
  selector: 'app-queue-status',
  templateUrl: './queue-status.component.html',
  styleUrls: ['./queue-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QueueStatusComponent {

  playerCount: Observable<number> = this.store.pipe(
    select(queueCurrentPlayerCount),
  );
  requiredPlayerCount: Observable<number> = this.store.pipe(
    select(queueRequiredPlayerCount),
  );
  state = this.store.select(queueState);
  loading = this.store.select(isQueueLoading);

  constructor(
    private store: Store,
  ) { }

}
