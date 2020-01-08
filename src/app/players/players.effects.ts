import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { PlayersService } from './players.service';
import { map, mergeMap, catchError, switchMap } from 'rxjs/operators';
import { loadPlayer, playerLoaded, playerEdited, playerSkillLoaded, loadPlayerSkill, loadPlayers, playersLoaded, loadPlayerBans,
  playerBansLoaded, revokePlayerBan, playerBanUpdated, addPlayerBan, playerBanAdded, loadAllPlayerSkills, allPlayerSkillsLoaded,
  failedToLoadPlayerSkill, initializeDefaultPlayerSkill, setPlayerName, setPlayerRole, setPlayerSkill, playerSkillEdited } from './actions';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class PlayerEffects {

  loadPlayer = createEffect(() =>
    this.actions.pipe(
      ofType(loadPlayer),
      mergeMap(({ playerId }) => this.playersService.fetchPlayer(playerId)),
      map(player => playerLoaded({ player })),
    )
  );

  setPlayerName = createEffect(() =>
    this.actions.pipe(
      ofType(setPlayerName),
      mergeMap(({ playerId, name }) => this.playersService.setPlayerName(playerId, name).pipe(
        map(player => playerEdited({ player })),
      )),
    )
  );

  setPlayerRole = createEffect(() =>
    this.actions.pipe(
      ofType(setPlayerRole),
      mergeMap(({ playerId, role }) => this.playersService.setPlayerRole(playerId, role).pipe(
        map(player => playerEdited({ player })),
      )),
    )
  );

  loadPlayerSkill = createEffect(() =>
    this.actions.pipe(
      ofType(loadPlayerSkill),
      mergeMap(({ playerId }) => this.playersService.fetchPlayerSkill(playerId).pipe(
        map(playerSkill => playerSkillLoaded({ playerId, skill: playerSkill })),
        catchError(error => {
          if (error instanceof HttpErrorResponse) {
            if (error.status === 404) {
              return of(initializeDefaultPlayerSkill({ playerId }));
            } else {
              return of(failedToLoadPlayerSkill({ error }));
            }
          } else {
            return throwError(error);
          }
        }),
      )),
    )
  );

  setPlayerSkill = createEffect(() =>
    this.actions.pipe(
      ofType(setPlayerSkill),
      mergeMap(({ playerId, skill }) => this.playersService.setPlayerSkill(playerId, skill).pipe(
        map(editedSkill => playerSkillEdited({ playerId, skill: editedSkill })),
      )),
    )
  );

  initializeDefaultPlayerSkill = createEffect(() =>
    this.actions.pipe(
      ofType(initializeDefaultPlayerSkill),
      switchMap(({ playerId }) => this.playersService.defaultSkill(playerId).pipe(
        map(skill => playerSkillLoaded({ playerId, skill }))
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
