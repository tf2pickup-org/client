import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '@app/app.state';
import { mapVoteResults } from '../queue.selectors';

@Component({
  selector: 'app-map-vote',
  templateUrl: './map-vote.component.html',
  styleUrls: ['./map-vote.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapVoteComponent implements OnInit {

  results = this.store.select(mapVoteResults);

  constructor(
    private store: Store<AppState>,
  ) { }

  ngOnInit() {
  }

}
