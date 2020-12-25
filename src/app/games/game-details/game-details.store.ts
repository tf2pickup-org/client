import { Injectable } from '@angular/core';
import { loadGameServer } from '@app/game-servers/game-servers.actions';
import { gameServerById } from '@app/game-servers/game-servers.selectors';
import { GameServer } from '@app/game-servers/models/game-server';
import { loadPlayer } from '@app/players/actions';
import { Player } from '@app/players/models/player';
import { playerById } from '@app/players/selectors';
import { isAdmin, isBanned, isLoggedIn, profile } from '@app/profile/profile.selectors';
import { ComponentStore } from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import { from, Observable } from 'rxjs';
import { filter, first, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { forceEndGame, loadGame, reinitializeServer, replacePlayer, requestSubstitute } from '../games.actions';
import { activeGame, gameById } from '../games.selectors';
import { Game } from '../models/game';
import { GamePlayer } from '../models/game-player';
import { ResolvedGamePlayer } from '../models/resolved-game-player';
import { Tf2Team } from '../models/tf2-team';
import { createMumbleUrl } from './create-mumble-url';

interface GameDetailsState {
  game: Game;
  server: GameServer;
  players: Record<string, Player>;
  skills: Record<string, number>;
}

@Injectable()
export class GameDetailsStore extends ComponentStore<GameDetailsState> {

  // selectors
  readonly game = this.select(state => state.game);
  readonly isRunning = this.select(this.game, game => /launching|started/.test(game?.state));
  readonly score = this.select(this.game, game => game?.score);
  readonly serverName = this.select(state => state.server?.name);

  readonly isMyGame = this.select(
    this.store.select(profile),
    this.game,
    // eslint-disable-next-line no-shadow
    (profile, game) => !!(game?.slots.find(s => s.player === profile?.id)?.status.match(/active|waiting for substitute/))
  );

  readonly mumbleUrl = this.select(
    this.store.select(profile),
    this.game,
    // eslint-disable-next-line no-shadow
    (profile, game) => createMumbleUrl(game, profile)
  );

  readonly canSubstitute = this.select(
    this.store.select(isLoggedIn),
    this.store.select(isBanned),
    this.store.select(activeGame),
    this.isRunning,
    // eslint-disable-next-line no-shadow
    (isLoggedIn, isBanned, activeGame, isRunning) =>
      isLoggedIn &&
      !isBanned &&
      !activeGame &&
      isRunning
  );

  readonly players: Observable<ResolvedGamePlayer[]> = this.select(state => state.game?.slots.map(slot => ({
    ...slot,
    ...state.players?.[slot.player],
  })));

  readonly showAdminTools = this.select(
    this.store.select(isAdmin),
    this.isRunning,
    // eslint-disable-next-line no-shadow
    (isAdmin, isRunning) => isAdmin && isRunning
  );

  // effects
  readonly setGameId = this.effect((gameId: Observable<string>) => gameId.pipe(
    switchMap(id => this.store.select(gameById(id)).pipe(
      tap(game => {
        if (!game) {
          this.store.dispatch(loadGame({ gameId: id }));
        }
      }),
    )),
    filter(game => !!game),
    tap(game => this.setGame(game)),
    tap(game => this.setGameServerId(game.gameServer)),
    tap((game: Game) => this.resolvePlayers(game.slots)),
  ));

  private readonly setGameServerId = this.effect((gameServerId: Observable<string>) => gameServerId.pipe(
    switchMap(id => this.store.select(gameServerById(id)).pipe(
      tap(server => {
        if (!server) {
          this.store.dispatch(loadGameServer({ gameServerId: id }));
        }
      }),
    )),
    tap((server: GameServer) => this.setServer(server)),
  ));

  private readonly resolvePlayers = this.effect((slots: Observable<GamePlayer[]>) => slots.pipe(
    switchMap(_slots => from(_slots)),
    filter(slot => /active|waiting for substitute/.test(slot.status)),
    mergeMap(slot => this.store.select(playerById(slot.player)).pipe(
      tap(player => {
        if (!player) {
          this.store.dispatch(loadPlayer({ playerId: slot.player }));
        }
      }),
      filter(player => !!player),
      tap(player => this.addPlayer(player)),
    )),
  ));

  // updaters
  private readonly setGame = this.updater((state, game: Game) => ({
    ...state,
    game,
  }));

  private readonly setServer = this.updater((state, server: GameServer) => ({
    ...state,
    server,
  }));

  private readonly addPlayer = this.updater((state, player: Player) => ({
    ...state,
    players: { ...state.players, [player.id]: { ...player } },
  }));

  constructor(
    private store: Store,
  ) {
    super({
      game: null,
      server: null,
      players: null,
      skills: null,
    });
  }

  playersOf(team: Tf2Team) {
    return this.select(this.players, players => players.filter(p => p.team === team));
  }

  scoreOf(team: Tf2Team) {
    return this.select(this.score, score => score?.[team]);
  }

  reinitializeServer() {
    this.game.pipe(
      first(game => !!game),
      map(game => game.id),
    ).subscribe(gameId => this.store.dispatch(reinitializeServer({ gameId })));
  }

  forceEnd() {
    this.game.pipe(
      first(game => !!game),
      map(game => game.id),
    ).subscribe(gameId => this.store.dispatch(forceEndGame({ gameId })));
  }

  requestSubstitute(playerId: string) {
    this.game.pipe(
      first(game => !!game),
      map(game => game.id),
    ).subscribe(gameId => this.store.dispatch(requestSubstitute({ gameId, playerId })));
  }

  replacePlayer(replaceeId: string) {
    this.game.pipe(
      first(game => !!game),
      map(game => game.id),
    ).subscribe(gameId => this.store.dispatch(replacePlayer({ gameId, replaceeId })));
  }

}
