import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { PlayersService } from './players.service';
import { map, mergeMap } from 'rxjs/operators';
import {
  loadPlayer,
  playerLoaded,
  loadPlayers,
  playersLoaded,
  loadPlayerBans,
  playerBansLoaded,
  revokePlayerBan,
  playerBanUpdated,
  addPlayerBan,
  playerBanAdded,
  loadLinkedProfiles,
  linkedProfilesLoaded,
  onlinePlayersLoaded,
  playerConnected,
  playerDisconnected,
  loadOnlinePlayers,
} from './actions';
import { Store } from '@ngrx/store';
import { Socket } from '@app/io/socket';
import { fromEvent } from 'rxjs';
import { Player } from './models/player';

@Injectable()
export class PlayerEffects {
  loadPlayer = createEffect(() => {
    return this.actions.pipe(
      ofType(loadPlayer),
      mergeMap(({ playerId }) => this.playersService.fetchPlayer(playerId)),
      map(player => playerLoaded({ player })),
    );
  });

  loadAllPlayers = createEffect(() => {
    return this.actions.pipe(
      ofType(loadPlayers),
      mergeMap(() =>
        this.playersService
          .fetchAllPlayers()
          .pipe(map(players => playersLoaded({ players }))),
      ),
    );
  });

  loadPlayerBans = createEffect(() => {
    return this.actions.pipe(
      ofType(loadPlayerBans),
      mergeMap(({ playerId }) =>
        this.playersService
          .fetchPlayerBans(playerId)
          .pipe(map(playerBans => playerBansLoaded({ playerBans }))),
      ),
    );
  });

  addPlayerBan = createEffect(() => {
    return this.actions.pipe(
      ofType(addPlayerBan),
      mergeMap(({ playerBan: ban }) =>
        this.playersService
          .addPlayerBan(ban)
          .pipe(map(playerBan => playerBanAdded({ playerBan }))),
      ),
    );
  });

  revokePlayerBan = createEffect(() => {
    return this.actions.pipe(
      ofType(revokePlayerBan),
      mergeMap(({ playerBan: ban }) =>
        this.playersService
          .revokePlayerBan(ban)
          .pipe(map(playerBan => playerBanUpdated({ playerBan }))),
      ),
    );
  });

  loadLinkedProfiles = createEffect(() => {
    return this.actions.pipe(
      ofType(loadLinkedProfiles),
      mergeMap(({ playerId }) =>
        this.playersService
          .fetchPlayerLinkedProfiles(playerId)
          .pipe(
            map(linkedProfiles => linkedProfilesLoaded({ linkedProfiles })),
          ),
      ),
    );
  });

  loadOnlinePlayers = createEffect(() => {
    return this.actions.pipe(
      ofType(loadOnlinePlayers),
      mergeMap(() =>
        this.playersService
          .fetchOnlinePlayers()
          .pipe(map(players => onlinePlayersLoaded({ players }))),
      ),
    );
  });

  constructor(
    private actions: Actions,
    private playersService: PlayersService,
    private store: Store,
    socket: Socket,
  ) {
    fromEvent<Player>(socket, 'player connected').subscribe(player =>
      this.store.dispatch(playerConnected({ player })),
    );
    fromEvent<Player>(socket, 'player disconnected').subscribe(player =>
      this.store.dispatch(playerDisconnected({ player })),
    );
  }
}
