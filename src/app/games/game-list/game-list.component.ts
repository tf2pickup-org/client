import { Component, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { ReplaySubject, BehaviorSubject, Subject } from 'rxjs';
import { Game } from '../models/game';
import { GamesService } from '../games.service';
import { switchMap, map, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameListComponent implements OnInit, OnDestroy {

  readonly gamesPerPage = 10;

  page = new BehaviorSubject<number>(1);
  gameCount = new ReplaySubject<number>(1);
  games = new ReplaySubject<Game[]>(1);

  private destroyed = new Subject<void>();

  constructor(
    private gamesService: GamesService,
  ) { }

  ngOnInit() {
    this.page.pipe(
      map(page => page - 1),
      switchMap(page => this.gamesService.fetchGames(page * this.gamesPerPage, this.gamesPerPage)),
      takeUntil(this.destroyed),
    ).subscribe(response => {
      this.gameCount.next(response.itemCount);
      this.games.next(response.results);
    });
  }

  getPage(page: number) {
    this.page.next(page);
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

}
