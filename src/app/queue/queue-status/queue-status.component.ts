import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { queueCurrentPlayerCount, queueRequiredPlayerCount, queueState } from '../queue.selectors';
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

  constructor(
    private store: Store<AppState>,
  ) { }

}
