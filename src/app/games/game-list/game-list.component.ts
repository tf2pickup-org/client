import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ReplaySubject, BehaviorSubject } from 'rxjs';
import { Game } from '../models/game';
import { Title } from '@angular/platform-browser';
import { environment } from '@environment';
import { GamesService } from '../games.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameListComponent implements OnInit {

  private readonly gamesPerPage = 10;
  private page = new BehaviorSubject<number>(0);
  gameCount = new ReplaySubject<number>(1);
  games = new ReplaySubject<Game[]>(1);

  constructor(
    private title: Title,
    private gamesService: GamesService,
  ) {
    this.page.pipe(
      switchMap(page => this.gamesService.fetchGames(page * this.gamesPerPage, this.gamesPerPage)),
    ).subscribe(response => {
      this.gameCount.next(response.itemCount);
      this.games.next(response.results);
    });
  }

  ngOnInit() {
    this.title.setTitle(`games • ${environment.titleSuffix}`);
  }

  pageChanged(event: { page: number }) {
    this.page.next(event.page - 1);
  }

}
