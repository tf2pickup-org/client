import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { queueCurrentPlayerCount, queueRequiredPlayerCount, queueState, queueMap } from '../queue.selectors';
import { QueueState } from '../models/queue-state';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-queue-status',
  templateUrl: './queue-status.component.html',
  styleUrls: ['./queue-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QueueStatusComponent {

  playerCount: Observable<number> = this.store.select(queueCurrentPlayerCount).pipe(debounceTime(100));
  requiredPlayerCount: Observable<number> = this.store.select(queueRequiredPlayerCount);
  state = this.store.select(queueState);
  map: Observable<string> = this.store.select(queueMap);

  constructor(
    private store: Store<AppState>,
  ) { }

}
