import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { queueCurrentPlayerCount, queueRequiredPlayerCount, queueState, queueMap, isInQueue,
    mapChangeVoterCount, queueConfig, votesForMapChange } from '../queue.selectors';
import { QueueState } from '../models/queue-state';
import { toggleVoteForMapChange } from '../queue.actions';
import { map, filter, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-queue-status',
  templateUrl: './queue-status.component.html',
  styleUrls: ['./queue-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QueueStatusComponent {

  playerCount: Observable<number> = this.store.select(queueCurrentPlayerCount).pipe(debounceTime(100));
  requiredPlayerCount: Observable<number> = this.store.select(queueRequiredPlayerCount);
  state: Observable<QueueState>  = this.store.select(queueState);
  map: Observable<string> = this.store.select(queueMap);
  isInQueue: Observable<boolean> = this.store.select(isInQueue).pipe(debounceTime(100));
  mapChangeVoteTooltipText: Observable<string> =
    combineLatest([
      this.store.select(mapChangeVoterCount),
      this.store.select(queueConfig).pipe(filter(config => !!config)),
    ]).pipe(
      map(([count, config]) => `${count}/${config.nextMapSuccessfulVoteThreshold}`),
    );
    votesForMapChange: Observable<boolean> = this.store.select(votesForMapChange);

  votes = false;

  constructor(
    private store: Store<AppState>,
  ) { }

  voteForMapChangeToggle() {
    this.store.dispatch(toggleVoteForMapChange());
  }

}
