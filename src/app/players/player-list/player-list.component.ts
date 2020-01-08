import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { allPlayers } from '../selectors';
import { Player } from '../models/player';
import { loadPlayers } from '../actions';
import { Title } from '@angular/platform-browser';
import { environment } from '@environment';

@Component({
  selector: 'app-player-list',
  templateUrl: './player-list.component.html',
  styleUrls: ['./player-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerListComponent implements OnInit {

  players: Observable<Player[]> = this.store.select(allPlayers);

  constructor(
    private store: Store<{}>,
    private title: Title,
  ) { }

  ngOnInit() {
    this.store.dispatch(loadPlayers());
    this.title.setTitle(`players • ${environment.titleSuffix}`);
  }

}
