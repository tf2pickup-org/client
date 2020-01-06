import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppState } from '@app/app.state';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Player } from '../models/player';
import { map, switchMap, tap } from 'rxjs/operators';
import { playerById } from '../selectors';
import { loadPlayer } from '../actions';
import { PlayersService } from '../players.service';
import { profile, isAdmin, isSuperUser } from '@app/profile/profile.selectors';
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
  stats: Observable<PlayerStats>;
  isAdmin: Observable<boolean> = this.store.select(isAdmin);
  isSuperUser: Observable<boolean> = this.store.select(isSuperUser);

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
  }

}
