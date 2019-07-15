import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '@app/app.state';
import { Observable, zip } from 'rxjs';
import { Game } from '../models/game';
import { ActivatedRoute } from '@angular/router';
import { switchMap, map, tap, filter } from 'rxjs/operators';
import { gameById } from '../games.selectors';
import { loadGame } from '../games.actions';
import { Player } from '@app/player/models/player';
import { playerById } from '@app/player/player.selectors';
import { loadPlayer } from '@app/player/player.actions';

@Component({
  selector: 'app-game-details',
  templateUrl: './game-details.component.html',
  styleUrls: ['./game-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameDetailsComponent implements OnInit {

  game: Observable<Game>;
  playersRed: Observable<Player[]>;
  playersBlu: Observable<Player[]>;

  constructor(
    private route: ActivatedRoute,
    private store: Store<AppState>,
  ) { }

  ngOnInit() {
    this.game = this.route.paramMap.pipe(
      map(params => params.get('id')),
      switchMap(id => this.store.select(gameById(id)).pipe(
        tap(game => {
          if (!game) {
            this.store.dispatch(loadGame({ gameId: id }));
          }
        }),
      )),
      filter(game => !!game),
      tap(game => {
        const playersForTeam = (teamId: string) => zip(
          ...game.players
            .filter(p => p.teamId === teamId)
            .map(p => p.playerId)
            .map(playerId =>
              this.store.select(playerById(playerId)).pipe(
                tap(player => {
                  if (!player) {
                    this.store.dispatch(loadPlayer({ playerId }));
                  }
                }),
              )
            )
        );

        const redTeamId = Object.keys(game.teams).find(key => game.teams[key] === 'RED');
        this.playersRed = playersForTeam(redTeamId);
        const bluTeamId = Object.keys(game.teams).find(key => game.teams[key] === 'BLU');
        this.playersBlu = playersForTeam(bluTeamId);
      }),
    );
  }

}
