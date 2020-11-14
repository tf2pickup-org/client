import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { mapVoteResults, mapVoteTotalCount, mapVote, isInQueue } from '../queue.selectors';
import { voteForMap } from '../queue.actions';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-map-vote',
  templateUrl: './map-vote.component.html',
  styleUrls: ['./map-vote.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapVoteComponent {

  results = combineLatest([ this.store.select(mapVoteResults), this.store.select(mapVoteTotalCount) ]).pipe(
    map(([ results, total ]) => results.map(r => ({ ...r, votePercent: total > 0 ? r.voteCount / total : 0 }))),
  );
  mapVote = this.store.select(mapVote);
  disabled = this.store.pipe(
    select(isInQueue),
    map(value => !value),
  );

  constructor(
    private store: Store,
  ) { }

  voteForMap(aMap: string) {
    this.store.dispatch(voteForMap({ map: aMap }));
  }

}
