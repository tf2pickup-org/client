import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { PlayersService } from './players.service';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { loadPlayer, playerLoaded, playerEdited, editPlayer, playerSkillLoaded, loadPlayerSkill, loadPlayers,
  playersLoaded, loadPlayerBans, playerBansLoaded, revokePlayerBan, playerBanUpdated, addPlayerBan, playerBanAdded, loadAllPlayerSkills,
  allPlayerSkillsLoaded,
  failedToLoadPlayerSkill} from './actions';
import { of } from 'rxjs';

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
        catchError(error => of(failedToLoadPlayerSkill({ error }))),
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

  loadAllPlayerSkills = createEffect(() =>
    this.actions.pipe(
      ofType(loadAllPlayerSkills),
      mergeMap(() => this.playersService.fetchAllPlayerSkills().pipe(
        map(playerSkills => allPlayerSkillsLoaded({ playerSkills })),
      )),
    )
  );

  loadPlayerBans = createEffect(() =>
    this.actions.pipe(
      ofType(loadPlayerBans),
      mergeMap(({ playerId }) => this.playersService.fetchPlayerBans(playerId).pipe(
        map(playerBans => playerBansLoaded({ playerBans })),
      )),
    )
  );

  addPlayerBan = createEffect(() =>
    this.actions.pipe(
      ofType(addPlayerBan),
      mergeMap(({ playerBan: ban }) => this.playersService.addPlayerBan(ban).pipe(
        map(playerBan => playerBanAdded({ playerBan })),
      )),
    )
  );

  revokePlayerBan = createEffect(() =>
    this.actions.pipe(
      ofType(revokePlayerBan),
      mergeMap(({ playerBan: ban }) => this.playersService.revokePlayerBan(ban).pipe(
        map(playerBan => playerBanUpdated({ playerBan })),
      )),
    )
  );

  constructor(
    private actions: Actions,
    private playersService: PlayersService,
  ) { }

}
