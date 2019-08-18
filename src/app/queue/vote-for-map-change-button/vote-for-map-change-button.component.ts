import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '@app/app.state';
import { isInQueue, mapChangeVoterCount, queueConfig, votesForMapChange } from '../queue.selectors';
import { debounceTime, filter, map } from 'rxjs/operators';
import { Observable, combineLatest } from 'rxjs';
import { toggleVoteForMapChange } from '../queue.actions';

@Component({
  selector: 'app-vote-for-map-change-button',
  templateUrl: './vote-for-map-change-button.component.html',
  styleUrls: ['./vote-for-map-change-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VoteForMapChangeButtonComponent {

  isInQueue = this.store.select(isInQueue);
  votesForMapChange = this.store.select(votesForMapChange);
  statusText: Observable<string> =
    combineLatest([
      this.store.select(mapChangeVoterCount).pipe(debounceTime(100)),
      this.store.select(queueConfig).pipe(filter(config => !!config)),
    ]).pipe(
      map(([count, config]) => `${count}/${config.nextMapSuccessfulVoteThreshold}`),
    );

  constructor(
    private store: Store<AppState>,
  ) { }

  voteForMapChangeToggle() {
    this.store.dispatch(toggleVoteForMapChange());
  }

}
