import { Injectable } from '@angular/core';
import { loadGameServer } from '@app/game-servers/game-servers.actions';
import { gameServerById } from '@app/game-servers/game-servers.selectors';
import { GameServer } from '@app/game-servers/models/game-server';
import { loadPlayer } from '@app/players/actions';
import { Player } from '@app/players/models/player';
import { playerById } from '@app/players/selectors';
import { currentPlayer, isAdmin, isBanned, isLoggedIn, profile } from '@app/profile/profile.selectors';
import { ComponentStore } from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import { from, Observable } from 'rxjs';
import { filter, first, map, mergeMap, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { forceEndGame, loadGame, reinitializeServer, replacePlayer, requestSubstitute } from '../games.actions';
import { activeGame, gameById } from '../games.selectors';
import { GamesService } from '../games.service';
import { Game } from '../models/game';
import { GameSlot } from '../models/game-slot';
import { ResolvedGameSlot } from '../models/resolved-game-slot';
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
    this.store.select(currentPlayer),
    this.game,
    // eslint-disable-next-line no-shadow
    (player, game) => !!(game?.slots.find(s => s.player === player?.id)?.status.match(/active|waiting for substitute/))
  );

  readonly mumbleUrl = this.select(
    this.store.select(currentPlayer),
    this.game,
    // eslint-disable-next-line no-shadow
    (player, game) => createMumbleUrl(game, player)
  );

  readonly canSubstitute = this.select(
    this.store.select(isLoggedIn),
    this.store.select(isBanned),
    this.store.select(activeGame),
    this.game,
    // eslint-disable-next-line no-shadow
    (isLoggedIn, isBanned, activeGame, game) =>
      isLoggedIn &&
      !isBanned &&
      (!activeGame || activeGame.id === game.id) &&
      /launching|started/.test(game?.state)
  );

  readonly players: Observable<ResolvedGameSlot[]> = this.select(state => state.game?.slots
    .filter(slot => slot.status.match(/active|waiting for substitute/))
    .map(slot => ({
      ...slot,
      ...state.players?.[slot.player],
      classSkill: state.skills?.[slot.player],
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
    tap(game => this.fetchGameSkills(game.id)),
    tap(game => this.setGame(game)),
    tap(game => this.setGameServerId(game.gameServer)),
    tap((game: Game) => this.resolvePlayers(game.slots)),
  ));

  private readonly fetchGameSkills = this.effect((gameId: Observable<string>) => gameId.pipe(
    withLatestFrom(this.store.select(isAdmin)),
    // eslint-disable-next-line no-shadow
    filter(([, isAdmin]) => isAdmin),
    // eslint-disable-next-line no-shadow
    map(([gameId]) => this.gamesService.fetchGameSkills(gameId)),
    map(result => this.setSkills(result)),
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

  private readonly resolvePlayers = this.effect((slots: Observable<GameSlot[]>) => slots.pipe(
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

  private readonly setSkills = this.updater((state, skills: Record<string, number>) => ({
    ...state,
    skills,
  }));

  constructor(
    private store: Store,
    private gamesService: GamesService,
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
