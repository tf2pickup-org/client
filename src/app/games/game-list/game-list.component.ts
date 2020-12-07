import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { GameListStore } from './game-list.store';

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ GameListStore ],
})
export class GameListComponent implements OnInit {

  constructor(
    public readonly store: GameListStore,
  ) { }

  ngOnInit() {
    this.loadPage(1);
  }

  loadPage(page: number) {
    this.store.loadPage(page);
  }

}
