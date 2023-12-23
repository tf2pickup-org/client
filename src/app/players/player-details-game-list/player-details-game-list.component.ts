import {
  Component,
  ChangeDetectionStrategy,
  Input,
  OnDestroy,
} from '@angular/core';
import { BehaviorSubject, ReplaySubject, Subject, combineLatest } from 'rxjs';
import { map, switchMap, takeUntil, filter } from 'rxjs/operators';
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
export class PlayerDetailsGameListComponent implements OnDestroy {
  readonly gamesPerPage = 10;

  page = new BehaviorSubject<number>(1);
  gameCount = new ReplaySubject<number>(1);
  games = new ReplaySubject<(Game & ClassPlayed)[]>(1);
  isLoading = new BehaviorSubject<boolean>(true);

  private destroyed = new Subject<void>();
  private _playerId = new ReplaySubject<string>(1);

  @Input()
  set playerId(playerId: string) {
    this._playerId.next(playerId);
  }

  constructor(private playersService: PlayersService) {
    this.page
      .pipe(takeUntil(this.destroyed))
      .subscribe(() => this.isLoading.next(true));
    this.games
      .pipe(takeUntil(this.destroyed))
      .subscribe(() => this.isLoading.next(false));

    combineLatest([
      this.page,
      this._playerId.pipe(filter(playerId => !!playerId)),
    ])
      .pipe(
        switchMap(([page, playerId]) =>
          this.playersService
            .fetchPlayerGames(
              playerId,
              (page - 1) * this.gamesPerPage,
              this.gamesPerPage,
            )
            .pipe(
              map(response => {
                this.gameCount.next(response.itemCount);
                this.games.next(
                  response.results.map(game => ({
                    ...game,
                    classPlayed: game.slots.find(s => s.player.id === playerId)!
                      .gameClass,
                  })),
                );
              }),
            ),
        ),
        takeUntil(this.destroyed),
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  getPage(page: number) {
    this.page.next(page);
  }
}
