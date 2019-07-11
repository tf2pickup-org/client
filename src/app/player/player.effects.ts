import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType, OnInitEffects } from '@ngrx/effects';
import { loadPlayers, playersLoaded } from './player.actions';
import { PlayersService } from './players.service';
import { map, mergeMap } from 'rxjs/operators';

@Injectable()
export class PlayerEffects implements OnInitEffects {

  loadPlayers = createEffect(() =>
    this.actions.pipe(
      ofType(loadPlayers),
      mergeMap(() => this.playersService.fetchOnlinePlayers()),
      map(players => playersLoaded({ players })),
    )
  );

  constructor(
    private actions: Actions,
    private playersService: PlayersService,
  ) { }

  ngrxOnInitEffects() {
    return loadPlayers();
  }

}
