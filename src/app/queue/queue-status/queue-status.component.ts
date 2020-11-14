import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { queueCurrentPlayerCount, queueRequiredPlayerCount, queueState } from '../queue.selectors';
import { startWith } from 'rxjs/operators';

@Component({
  selector: 'app-queue-status',
  templateUrl: './queue-status.component.html',
  styleUrls: ['./queue-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QueueStatusComponent {

  playerCount: Observable<number> = this.store.pipe(
    select(queueCurrentPlayerCount),
    startWith(0),
  );
  requiredPlayerCount: Observable<number> = this.store.pipe(
    select(queueRequiredPlayerCount),
    startWith(0),
  );
  state = this.store.select(queueState);

  constructor(
    private store: Store,
  ) { }

}
