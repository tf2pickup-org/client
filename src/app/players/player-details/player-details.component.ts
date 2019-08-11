import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppState } from '@app/app.state';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Player } from '../models/player';
import { map, switchMap, tap, first } from 'rxjs/operators';
import { playerById } from '../players.selectors';
import { loadPlayer } from '../players.actions';
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

  player: Observable<Player>;
  games: Observable<Game[]>;
  stats: Observable<PlayerStats>;
  isAdmin: Observable<boolean> = this.store.pipe(
    select(profile),
    map(theProfile => theProfile && (theProfile.role === 'admin' || theProfile.role === 'super-user')),
  );

  constructor(
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private playersService: PlayersService,
    private router: Router,
    private title: Title,
  ) { }

  ngOnInit() {
    const getPlayerId = this.route.paramMap.pipe(
      map(params => params.get('id')),
    );

    this.player = getPlayerId.pipe(
      tap(id => {
        this.games = this.playersService.fetchPlayerGames(id);
        this.stats = this.playersService.fetchPlayerStats(id);
      }),
      switchMap(id => this.store.select(playerById(id)).pipe(
        tap(player => {
          if (!player) {
            this.store.dispatch(loadPlayer({ playerId: id }));
          } else {
            this.title.setTitle(`${player.name} • ${environment.titleSuffix}`);
          }
        })
      ))
    );
  }

  editPlayer() {
    this.player.pipe(first()).subscribe(player => {
      this.router.navigate(['/player', player.id, 'edit']);
    });
  }

}
