import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { allPlayers } from '../selectors';
import { loadPlayers } from '../actions';
import { map } from 'rxjs/operators';
import { PlayerGroup } from './player-group';
import { groupPlayers } from './group-players';

@Component({
  selector: 'app-player-list',
  templateUrl: './player-list.component.html',
  styleUrls: ['./player-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerListComponent implements OnInit {
  players: Observable<PlayerGroup[]> = this.store
    .select(allPlayers)
    .pipe(map(players => groupPlayers(players)));

  constructor(private store: Store) {}

  ngOnInit() {
    this.store.dispatch(loadPlayers());
  }
}
