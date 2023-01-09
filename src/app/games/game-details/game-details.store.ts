import { Inject, Injectable } from '@angular/core';
import { GameServerOption } from '@app/game-servers/models/game-server-option';
import {
  activeGameId,
  currentPlayer,
  isAdmin,
  isBanned,
  isLoggedIn,
} from '@app/profile/profile.selectors';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { Observable, zip } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  first,
  map,
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
import { Tf2Team } from '../models/tf2-team';

interface GameDetailsState {
  game: Game;
  skills: Record<string, number>;
  connectInfo?: ConnectInfo;
  skillsVisible: boolean;
}

@Injectable()
export class GameDetailsStore extends ComponentStore<GameDetailsState> {
  // selectors
  readonly game = this.select(state => state.game);
  readonly isRunning = this.select(this.game, game =>
    /launching|started/.test(game?.state),
  );
  readonly score = this.select(this.game, game => game?.score);
  readonly serverName = this.select(state => state.game?.gameServer?.name);

  readonly isMyGame = this.select(
    this.store.select(currentPlayer),
    this.game,
    // eslint-disable-next-line no-shadow
    (player, game) =>
      ['active', 'waiting for substitute'].includes(
        game?.slots.find(s => s.player?.id === player?.id)?.status,
      ),
  );

  readonly canSubstitute = this.select(
    this.store.select(isLoggedIn),
    this.store.select(isBanned),
    this.store.select(activeGameId),
    this.game,
    (loggedIn, banned, activeGameIdValue, gameValue) =>
      loggedIn &&
      !banned &&
      (!activeGameIdValue || activeGameIdValue === gameValue.id) &&
      /launching|started/.test(gameValue?.state),
  );

  readonly players: Observable<GameSlot[]> = this.select(state =>
    state.game?.slots
      .filter(slot => /active|waiting for substitute/.test(slot.status))
      .map(slot => ({
        ...slot,
        classSkill: state.skills?.[slot.player.id],
      })),
  );

  readonly showAdminTools = this.select(
    this.store.select(isAdmin),
    this.isRunning,
    (isAdminValue, isRunningValue) => isAdminValue && isRunningValue,
  );

  readonly isAdmin = this.store.select(isAdmin);
  readonly skillsVisible = this.select(state => state.skillsVisible);

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
      filter(Boolean),
      tap(game => this.fetchGameSkills(game.id)),
      tap(game => this.setGame(game)),
      tap((game: Game) => this.fetchConnectInfo(game)),
    ),
  );

  private readonly fetchGameSkills = this.effect((gameId: Observable<string>) =>
    gameId.pipe(
      withLatestFrom(this.store.select(isAdmin)),
      filter(([, isAdmin]) => isAdmin),
      map(([gameId]) => this.gamesService.fetchGameSkills(gameId)),
      map(result => this.setSkills(result)),
    ),
  );

  private readonly fetchConnectInfo = this.effect((game: Observable<Game>) =>
    zip(this.isMyGame, this.isRunning).pipe(
      filter(([isMyGame, isRunning]) => isMyGame && isRunning),
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
  readonly setSkillsVisible = this.updater(
    (state, skillsVisible: boolean): GameDetailsState => {
      this.storage.set('skills_visible', skillsVisible);
      return {
        ...state,
        skillsVisible,
      };
    },
  );

  private readonly setGame = this.updater(
    (state, game: Game): GameDetailsState => ({
      ...state,
      game,
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

  constructor(
    private readonly store: Store,
    private readonly gamesService: GamesService,
    @Inject(LOCAL_STORAGE) private readonly storage: StorageService,
  ) {
    super({
      game: null,
      skills: null,
      skillsVisible: storage.get('skills_visible') ?? false,
    });
  }

  scoreOf(team: Tf2Team) {
    return this.select(this.score, score => score?.[team]);
  }

  reinitializeServer() {
    this.game
      .pipe(
        first(Boolean),
        map(game => game.id),
      )
      // eslint-disable-next-line ngrx/no-store-subscription
      .subscribe(gameId => this.store.dispatch(reinitializeServer({ gameId })));
  }

  forceEnd() {
    this.game
      .pipe(
        first(Boolean),
        map(game => game.id),
      )
      // eslint-disable-next-line ngrx/no-store-subscription
      .subscribe(gameId => this.store.dispatch(forceEndGame({ gameId })));
  }

  reassign(gameServer: GameServerOption) {
    this.game
      .pipe(
        first(Boolean),
        map(game => game.id),
      )
      .subscribe(gameId =>
        this.gamesService
          .reassign(gameId, {
            id: gameServer.id,
            provider: gameServer.provider,
          })
          .subscribe(),
      );
  }

  requestSubstitute(playerId: string) {
    this.game
      .pipe(
        first(Boolean),
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
        first(Boolean),
        map(game => game.id),
      )
      // eslint-disable-next-line ngrx/no-store-subscription
      .subscribe(gameId =>
        this.store.dispatch(replacePlayer({ gameId, replaceeId })),
      );
  }
}
