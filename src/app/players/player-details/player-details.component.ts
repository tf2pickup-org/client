import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppState } from '@app/app.state';
import { Store, select } from '@ngrx/store';
import { Observable, ReplaySubject, BehaviorSubject } from 'rxjs';
import { Player } from '../models/player';
import { map, switchMap, tap, first, withLatestFrom, mergeMap } from 'rxjs/operators';
import { playerById } from '../selectors';
import { loadPlayer } from '../actions';
import { Game } from '@app/games/models/game';
import { PlayersService } from '../players.service';
import { profile } from '@app/profile/profile.selectors';
import { PlayerStats } from '../models/player-stats';
import { Title } from '@angular/platform-browser';
import { environment } from '@environment';

@Component({
  selector: 'app-player-details',
  templateUrl: './player-details.component.html',
  styleUrls: ['./player-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerDetailsComponent implements OnInit {

  private readonly gamesPerPage = 10;
  private page = new BehaviorSubject<number>(0);
  games = new ReplaySubject<Game[]>(1);
  gameCount = new ReplaySubject<number>(1);
  player: Observable<Player>;
  stats: Observable<PlayerStats>;
  isAdmin: Observable<boolean> = this.store.pipe(
    select(profile),
    map(theProfile => theProfile && (theProfile.role === 'admin' || theProfile.role === 'super-user')),
  );

  constructor(
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private playersService: PlayersService,
    private title: Title,
  ) { }

  ngOnInit() {
    const getPlayerId = this.route.paramMap.pipe(
      map(params => params.get('id')),
    );

    this.player = getPlayerId.pipe(
      tap(playerId => this.stats = this.playersService.fetchPlayerStats(playerId)),
      switchMap(playerId => this.store.select(playerById(playerId)).pipe(
        tap(player => {
          if (!player) {
            this.store.dispatch(loadPlayer({ playerId }));
          } else {
            this.title.setTitle(`${player.name} • ${environment.titleSuffix}`);
          }
        }),
      )),
    );

    this.page.pipe(
      withLatestFrom(getPlayerId),
      switchMap(([page, playerId]) => this.playersService.fetchPlayerGames(playerId, page * this.gamesPerPage, this.gamesPerPage)),
    ).subscribe(response => {
      this.gameCount.next(response.itemCount);
      this.games.next(response.results);
    });
  }

  pageChanged(event: { page: number }) {
    this.page.next(event.page - 1);
  }

}
