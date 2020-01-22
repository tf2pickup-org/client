import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, Subject, ReplaySubject, combineLatest } from 'rxjs';
import { Game } from '../models/game';
import { ActivatedRoute } from '@angular/router';
import { switchMap, map, tap, filter, first, pairwise, shareReplay, takeUntil, startWith } from 'rxjs/operators';
import { gameById, isPlayingGame, activeGame } from '../games.selectors';
import { loadGame, forceEndGame, reinitializeServer, requestSubstitute, replacePlayer } from '../games.actions';
import { playerById } from '@app/players/selectors';
import { loadPlayer } from '@app/players/actions';
import { isAdmin, profile, isBanned } from '@app/profile/profile.selectors';
import { Title } from '@angular/platform-browser';
import { environment } from '@environment';
import { GamePlayer } from '../models/game-player';
import { GamesService } from '../games.service';
import { gameServerById } from '@app/game-servers/game-servers.selectors';
import { loadGameServer } from '@app/game-servers/game-servers.actions';
import { ResolvedGamePlayer } from '../models/resolved-game-player';
import { SoundPlayerService, Sound } from '@app/notifications/sound-player.service';

@Component({
  selector: 'app-game-details',
  templateUrl: './game-details.component.html',
  styleUrls: ['./game-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameDetailsComponent implements OnInit, OnDestroy {

  isAdmin: Observable<boolean> = this.store.select(isAdmin);
  game: Observable<Game>;
  gameServerName: Observable<string>;
  playersRed: Observable<ResolvedGamePlayer[]>;
  playersBlu: Observable<ResolvedGamePlayer[]>;
  isRunning: Observable<boolean>;
  isLocked: Observable<boolean>;
  private destroyed = new Subject<void>();
  private players = new ReplaySubject<ResolvedGamePlayer[]>(1);

  constructor(
    private route: ActivatedRoute,
    private store: Store<{}>,
    private title: Title,
    private gamesService: GamesService,
    private soundPlayerService: SoundPlayerService,
  ) { }

  ngOnInit() {
    const getGameId = this.route.paramMap.pipe(
      map(params => params.get('id')),
    );

    // retrieve the game
    this.game = getGameId.pipe(
      switchMap(gameId => this.store.select(gameById(gameId)).pipe(
        tap(game => {
          if (!game) {
            this.store.dispatch(loadGame({ gameId }));
          } else {
            this.title.setTitle(`Pickup #${game.number} • ${environment.titleSuffix}`);
          }
        }),
      )),
      filter(game => !!game),
      shareReplay(),
    );

    this.isRunning = this.game.pipe(map(game => game.state === 'launching' || game.state === 'started'));

    this.isLocked = combineLatest([
      this.isRunning,
      this.store.select(isPlayingGame),
      this.store.select(isBanned),
      this.game,
      this.store.select(activeGame),
    ]).pipe(
      map(([thisGameRunning, hasActiveGame, banned, theGame, theActiveGame]) => {
        return thisGameRunning && // the game is still active
          !banned &&
          (!hasActiveGame || theGame.id === theActiveGame.id); // isn't involved in any game
      }),
      map(canSub => !canSub),
    );

    // load game server
    this.gameServerName = this.game.pipe(
      map(game => game?.gameServer),
      filter(gameServerId => !!gameServerId),
      switchMap(gameServerId => this.store.select(gameServerById(gameServerId)).pipe(
        tap(gameServer => {
          if (!gameServer) {
            this.store.dispatch(loadGameServer({ gameServerId }));
          }
        }),
      )),
      map(gameServer => gameServer?.name),
    );

    // resolve game slot into a real player
    const resolveGamePlayer = (slot: GamePlayer) => this.store.pipe(
      select(playerById(slot.playerId)),
      tap(player => {
        if (!player) {
          this.store.dispatch(loadPlayer({ playerId: slot.playerId }));
        }
      }),
      filter(player => !!player),
      map(player => ({ ...player, ...slot })),
    );

    const resolvePlayers = this.game.pipe(
      map(game => game.slots),
      map(slots => slots.filter(s => s.status === 'active' || s.status === 'waiting for substitute')),
      switchMap(slots => combineLatest([
        ...slots.map(slot => resolveGamePlayer(slot))
      ]),
    ));

    const resolveSkills = this.isAdmin.pipe(
      filter(_isAdmin => _isAdmin),
      switchMap(() => getGameId),
      switchMap(gameId => this.gamesService.fetchGameSkills(gameId)),
      filter(skills => !!skills),
    );

    // load all players
    // tslint:disable-next-line: deprecation
    combineLatest([ resolvePlayers, resolveSkills.pipe(startWith(null)) ]).pipe(
      takeUntil(this.destroyed),
    ).subscribe(([players, skills]) => {
      if (skills) {
        const playersWithSkills = players.map(player => ({ ...player, classSkill: skills[player.id] || undefined }));
        this.players.next(playersWithSkills);
      } else {
        this.players.next(players);
      }
    });

    // get team id for the given team name
    const getTeamId = (teamName: string) => this.game.pipe(
      map(game => Object.keys(game.teams).find(key => game.teams[key] === teamName)),
    );

    // divide players into red and blu
    this.playersRed = combineLatest([this.players, getTeamId('RED')]).pipe(
      map(([allPlayers, redTeamId]) => allPlayers.filter(p => p.teamId === redTeamId)),
    );

    this.playersBlu = combineLatest([this.players, getTeamId('BLU')]).pipe(
      map(([allPlayers, bluTeamId]) => allPlayers.filter(p => p.teamId === bluTeamId)),
    );

    // play sound when the connect is available
    this.game.pipe(
      map(game => game.connectString),
      pairwise(),
      filter(([a, b])  => !a && !!b),
      takeUntil(this.destroyed),
    ).subscribe(() => {
      this.soundPlayerService.playSound(Sound.Fight);
    });
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.unsubscribe();
  }

  reinitializeServer() {
    this.game.pipe(
      first(),
      map(game => game.id),
    ).subscribe(gameId => this.store.dispatch(reinitializeServer({ gameId  })));
  }

  forceEndGame() {
    this.game.pipe(
      first(),
      map(game => game.id),
    ).subscribe(gameId => this.store.dispatch(forceEndGame({ gameId })));
  }

  requestSubstitute(playerId: string) {
    this.game.pipe(
      first(),
      map(game =>  game.id),
    ).subscribe(gameId => this.store.dispatch(requestSubstitute({ gameId, playerId })));
  }

  replacePlayer(replaceeId: string) {
    this.game.pipe(
      first(),
      map(game => game.id),
    ).subscribe(gameId => this.store.dispatch(replacePlayer({ gameId, replaceeId })));
  }

}
