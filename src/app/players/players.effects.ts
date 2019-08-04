import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { PlayersService } from './players.service';
import { map, mergeMap } from 'rxjs/operators';
import { loadPlayer, playerLoaded, playerEdited, editPlayer, playerSkillLoaded, loadPlayerSkill, loadPlayers,
  playersLoaded } from './players.actions';

@Injectable()
export class PlayerEffects {

  loadPlayer = createEffect(() =>
    this.actions.pipe(
      ofType(loadPlayer),
      mergeMap(({ playerId }) => this.playersService.fetchPlayer(playerId)),
      map(player => playerLoaded({ player })),
    )
  );

  editPlayer = createEffect(() =>
    this.actions.pipe(
      ofType(editPlayer),
      mergeMap(({ player }) => this.playersService.savePlayer(player).pipe(
        map(editedPlayer => playerEdited({ player: editedPlayer })),
      )),
    )
  );

  loadPlayerSkill = createEffect(() =>
    this.actions.pipe(
      ofType(loadPlayerSkill),
      mergeMap(({ playerId }) => this.playersService.fetchPlayerSkill(playerId).pipe(
        map(playerSkill => playerSkillLoaded({ playerSkill })),
      )),
    )
  );

  loadAllPlayers = createEffect(() =>
    this.actions.pipe(
      ofType(loadPlayers),
      mergeMap(() => this.playersService.fetchAllPlayers().pipe(
        map(players => playersLoaded({ players })),
      )),
    )
  );

  constructor(
    private actions: Actions,
    private playersService: PlayersService,
  ) { }

}
