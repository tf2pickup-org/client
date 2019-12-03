import { Component, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '@app/app.state';
import { mapVoteResults, mapVoteTotalCount, mapVote } from '../queue.selectors';
import { voteForMap } from '../queue.actions';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-map-vote',
  templateUrl: './map-vote.component.html',
  styleUrls: ['./map-vote.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapVoteComponent implements OnInit, OnDestroy {

  results = this.store.select(mapVoteResults);
  totalVoteCount = 12;
  mapVote = this.store.select(mapVote);
  private destroyed = new Subject<void>();

  constructor(
    private store: Store<AppState>,
  ) { }

  ngOnInit() {
    this.store.pipe(
      select(mapVoteTotalCount),
      takeUntil(this.destroyed),
    ).subscribe(v => this.totalVoteCount = v);
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.unsubscribe();
  }

  voteForMap(map: string) {
    this.store.dispatch(voteForMap({ map }));
  }

}
