import { Injectable } from '@angular/core';
import { loadGameServer } from '@app/game-servers/game-servers.actions';
import { gameServerById } from '@app/game-servers/game-servers.selectors';
import { GameServer } from '@app/game-servers/models/game-server';
import { loadPlayer } from '@app/players/actions';
import { Player } from '@app/players/models/player';
import { playerById } from '@app/players/selectors';
import {
  activeGameId,
  currentPlayer,
  isAdmin,
  isBanned,
  isLoggedIn,
} from '@app/profile/profile.selectors';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import { from, Observable } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  first,
  map,
  mergeMap,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import {
  forceEndGame,
  loadGame,
  reinitializeServer,
  replacePlayer,
  requestSubstitute,
} from '../games.actions';
import { gameById } from '../games.selectors';
import { GamesService } from '../games.service';
import { ConnectInfo } from '../models/connect-info';
import { Game } from '../models/game';
import { GameSlot } from '../models/game-slot';
import { ResolvedGameSlot } from '../models/resolved-game-slot';
import { Tf2Team } from '../models/tf2-team';

interface GameDetailsState {
  game: Game;
  server: GameServer;
  players: Record<string, Player>;
  skills: Record<string, number>;
  connectInfo?: ConnectInfo;
}

@Injectable()
export class GameDetailsStore extends ComponentStore<GameDetailsState> {
  // selectors
  readonly game = this.select(state => state.game);
  readonly isRunning = this.select(this.game, game =>
    /launching|started/.test(game?.state),
  );
  readonly score = this.select(this.game, game => game?.score);
  readonly serverName = this.select(state => state.server?.name);

  readonly isMyGame = this.select(
    this.store.select(currentPlayer),
    this.game,
    // eslint-disable-next-line no-shadow
    (player, game) =>
      !!game?.slots
        .find(s => s.player === player?.id)
        ?.status.match(/active|waiting for substitute/),
  );

  readonly canSubstitute = this.select(
    this.store.select(isLoggedIn),
    this.store.select(isBanned),
    this.store.select(activeGameId),
    this.game,
    (isLoggedIn, isBanned, activeGameId, game) =>
      isLoggedIn &&
      !isBanned &&
      (!activeGameId || activeGameId === game.id) &&
      /launching|started/.test(game?.state),
  );

  readonly players: Observable<ResolvedGameSlot[]> = this.select(state =>
    state.game?.slots
      .filter(slot => slot.status.match(/active|waiting for substitute/))
      .map(slot => ({
        ...slot,
        ...state.players?.[slot.player],
        classSkill: state.skills?.[slot.player],
      })),
  );

  readonly showAdminTools = this.select(
    this.store.select(isAdmin),
    this.isRunning,
    // eslint-disable-next-line no-shadow
    (isAdmin, isRunning) => isAdmin && isRunning,
  );

  readonly connectInfoVersion = this.select(
    this.game,
    game => game?.connectInfoVersion,
  );
  readonly connectInfo = this.select(state => state.connectInfo);
  readonly connectString = this.select(
    this.connectInfo,
    connectInfo => connectInfo?.connectString,
  );
  readonly voiceChannelUrl = this.select(
    this.connectInfo,
    connectInfo => connectInfo?.voiceChannelUrl,
  );

  // effects
  readonly setGameId = this.effect((gameId: Observable<string>) =>
    gameId.pipe(
      switchMap(id =>
        this.store.select(gameById(id)).pipe(
          tap(game => {
            if (!game) {
              this.store.dispatch(loadGame({ gameId: id }));
            }
          }),
        ),
      ),
      filter(game => !!game),
      tap(game => this.fetchGameSkills(game.id)),
      tap(game => this.setGame(game)),
      tap(game => this.setGameServerId(game.gameServer)),
      tap(game => this.resolvePlayers(game.slots)),
      tap((game: Game) => this.fetchConnectInfo(game)),
    ),
  );

  private readonly fetchGameSkills = this.effect((gameId: Observable<string>) =>
    gameId.pipe(
      withLatestFrom(this.store.select(isAdmin)),
      // eslint-disable-next-line no-shadow
      filter(([, isAdmin]) => isAdmin),
      // eslint-disable-next-line no-shadow
      map(([gameId]) => this.gamesService.fetchGameSkills(gameId)),
      map(result => this.setSkills(result)),
    ),
  );

  private readonly setGameServerId = this.effect(
    (gameServerId: Observable<string>) =>
      gameServerId.pipe(
        switchMap(id =>
          this.store.select(gameServerById(id)).pipe(
            tap(server => {
              if (!server) {
                this.store.dispatch(loadGameServer({ gameServerId: id }));
              }
            }),
          ),
        ),
        tap((server: GameServer) => this.setServer(server)),
      ),
  );

  private readonly resolvePlayers = this.effect(
    (slots: Observable<GameSlot[]>) =>
      slots.pipe(
        switchMap(_slots => from(_slots)),
        filter(slot => /active|waiting for substitute/.test(slot.status)),
        mergeMap(slot =>
          this.store.select(playerById(slot.player)).pipe(
            tap(player => {
              if (!player) {
                this.store.dispatch(loadPlayer({ playerId: slot.player }));
              }
            }),
            filter(player => !!player),
            tap(player => this.addPlayer(player)),
          ),
        ),
      ),
  );

  private readonly fetchConnectInfo = this.effect((game: Observable<Game>) =>
    this.isMyGame.pipe(
      filter(isMyGame => isMyGame),
      switchMap(() => game),
      distinctUntilChanged(
        (game1, game2) => game1.connectInfoVersion === game2.connectInfoVersion,
      ),
      map(game => game.id),
      switchMap(gameId => this.gamesService.fetchConnectInfo(gameId)),
      tapResponse(
        (connectInfo: ConnectInfo) => this.setConnectInfo(connectInfo),
        error => console.error(error),
      ),
    ),
  );

  // updaters
  private readonly setGame = this.updater(
    (state, game: Game): GameDetailsState => ({
      ...state,
      game,
    }),
  );

  private readonly setServer = this.updater(
    (state, server: GameServer): GameDetailsState => ({
      ...state,
      server,
    }),
  );

  private readonly addPlayer = this.updater(
    (state, player: Player): GameDetailsState => ({
      ...state,
      players: { ...state.players, [player.id]: { ...player } },
    }),
  );

  private readonly setSkills = this.updater(
    (state, skills: Record<string, number>): GameDetailsState => ({
      ...state,
      skills,
    }),
  );

  private readonly setConnectInfo = this.updater(
    (state, connectInfo: ConnectInfo): GameDetailsState => ({
      ...state,
      connectInfo,
    }),
  );

  constructor(private store: Store, private gamesService: GamesService) {
    super({
      game: null,
      server: null,
      players: null,
      skills: null,
    });
  }

  playersOf(team: Tf2Team) {
    return this.select(this.players, players =>
      players.filter(p => p.team === team),
    );
  }

  scoreOf(team: Tf2Team) {
    return this.select(this.score, score => score?.[team]);
  }

  reinitializeServer() {
    this.game
      .pipe(
        first(game => !!game),
        map(game => game.id),
      )
      // eslint-disable-next-line ngrx/no-store-subscription
      .subscribe(gameId => this.store.dispatch(reinitializeServer({ gameId })));
  }

  forceEnd() {
    this.game
      .pipe(
        first(game => !!game),
        map(game => game.id),
      )
      // eslint-disable-next-line ngrx/no-store-subscription
      .subscribe(gameId => this.store.dispatch(forceEndGame({ gameId })));
  }

  requestSubstitute(playerId: string) {
    this.game
      .pipe(
        first(game => !!game),
        map(game => game.id),
      )
      // eslint-disable-next-line ngrx/no-store-subscription
      .subscribe(gameId =>
        this.store.dispatch(requestSubstitute({ gameId, playerId })),
      );
  }

  replacePlayer(replaceeId: string) {
    this.game
      .pipe(
        first(game => !!game),
        map(game => game.id),
      )
      // eslint-disable-next-line ngrx/no-store-subscription
      .subscribe(gameId =>
        this.store.dispatch(replacePlayer({ gameId, replaceeId })),
      );
  }
}
