import { Component, ChangeDetectionStrategy, Input, OnInit, OnDestroy } from '@angular/core';
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
import { map, switchMap, takeUntil } from 'rxjs/operators';
import { PlayersService } from '../players.service';
import { Game } from '@app/games/models/game';

interface ClassPlayed {
  classPlayed: string;
}

@Component({
  selector: 'app-player-details-game-list',
  templateUrl: './player-details-game-list.component.html',
  styleUrls: ['./player-details-game-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerDetailsGameListComponent implements OnInit, OnDestroy {

  readonly gamesPerPage = 10;
  private destroyed = new Subject<void>();
  page = new BehaviorSubject<number>(1);
  gameCount = new ReplaySubject<number>(1);
  games = new ReplaySubject<(Game & ClassPlayed)[]>(1);

  @Input()
  playerId: string;

  constructor(
    private playersService: PlayersService,
  ) { }

  ngOnInit() {
    this.page.pipe(
      map(page => page - 1),
      switchMap(page => this.playersService.fetchPlayerGames(this.playerId, page * this.gamesPerPage, this.gamesPerPage)),
      takeUntil(this.destroyed),
    ).subscribe(response => {
      this.gameCount.next(response.itemCount);

      this.games.next(response.results.map(game => (
        { ...game, classPlayed: game.slots.find(s => s.playerId === this.playerId)?.gameClass }
      )));
    });
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  getPage(page: number) {
    this.page.next(page);
  }

}
