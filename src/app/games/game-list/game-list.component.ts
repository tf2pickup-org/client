import { Component, ChangeDetectionStrategy, Input, OnInit } from '@angular/core';
import { ReplaySubject, BehaviorSubject, Observable } from 'rxjs';
import { Game } from '../models/game';
import { GamesService } from '../games.service';
import { switchMap, map } from 'rxjs/operators';
import { PlayersService } from '@app/players/players.service';
import { PaginatedList } from '@app/core/models/paginated-list';

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameListComponent implements OnInit {

  @Input()
  playerId?: string;

  readonly gamesPerPage = 10;

  page = new BehaviorSubject<number>(1);
  gameCount = new ReplaySubject<number>(1);
  games = new ReplaySubject<Game[]>(1);

  constructor(
    private gamesService: GamesService,
    private playersService: PlayersService,
  ) { }

  ngOnInit() {
    this.page.pipe(
      map(page => page - 1),
      switchMap(page => this.fetchGames(page * this.gamesPerPage, this.gamesPerPage)),
    ).subscribe(response => {
      this.gameCount.next(response.itemCount);
      this.games.next(response.results);
    });
  }

  getPage(page: number) {
    this.page.next(page);
  }

  private fetchGames(offset: number, limit: number): Observable<PaginatedList<Game>> {
    if (!!this.playerId) {
      return this.playersService.fetchPlayerGames(this.playerId, offset, limit);
    } else {
      return this.gamesService.fetchGames(offset, limit);
    }
  }

}
