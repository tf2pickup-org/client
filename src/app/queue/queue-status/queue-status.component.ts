import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { queueCurrentPlayerCount, queueRequiredPlayerCount } from '../queue.selectors';

@Component({
  selector: 'app-queue-status',
  templateUrl: './queue-status.component.html',
  styleUrls: ['./queue-status.component.scss']
})
export class QueueStatusComponent {

  playerCount: Observable<number> = this.store.select(queueCurrentPlayerCount);
  requiredPlayerCount: Observable<number> = this.store.select(queueRequiredPlayerCount);

  constructor(
    private store: Store<AppState>,
  ) { }

}
