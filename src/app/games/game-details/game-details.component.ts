import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, Subject, ReplaySubject, combineLatest } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { switchMap, map, tap, filter, first, pairwise, shareReplay, takeUntil, startWith } from 'rxjs/operators';
import { gameById, isGameRunning, isMyGame, mumbleUrl, gameScore } from '../games.selectors';
import { forceEndGame, reinitializeServer, requestSubstitute, replacePlayer, loadGame } from '../games.actions';
import { playerById } from '@app/players/selectors';
import { loadPlayer } from '@app/players/actions';
import { isAdmin, isBanned } from '@app/profile/profile.selectors';
import { Title } from '@angular/platform-browser';
import { environment } from '@environment';
import { GamePlayer } from '../models/game-player';
import { GamesService } from '../games.service';
import { gameServerById } from '@app/game-servers/game-servers.selectors';
import { loadGameServer } from '@app/game-servers/game-servers.actions';
import { ResolvedGamePlayer } from '../models/resolved-game-player';
import { SoundPlayerService, Sound } from '@app/notifications/sound-player.service';
import { canSubstituteInGame } from '@app/selectors';
import { tf2ClassPriority } from '../tf2-class-priority';

@Component({
  selector: 'app-game-details',
  templateUrl: './game-details.component.html',
  styleUrls: ['./game-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameDetailsComponent implements OnInit, OnDestroy {

  private destroyed = new Subject<void>();
  private players = new ReplaySubject<ResolvedGamePlayer[]>(1);

  gameId = new ReplaySubject<string>(1);

  game = this.gameId.pipe(
    switchMap(gameId => this.store.select(gameById(gameId))),
    filter(game => !!game),
    shareReplay(),
  );

  isRunning = this.gameId.pipe(
    switchMap(gameId => this.store.select(isGameRunning(gameId))),
  );

  isLocked = this.gameId.pipe(
    switchMap(gameId => this.store.select(canSubstituteInGame(gameId))),
    map(canSub => !canSub),
  );

  gameServerName = this.game.pipe(
    map(game => game.gameServer),
    filter(gameServerId => !!gameServerId),
    switchMap(gameServerId => this.store.pipe(
      select(gameServerById(gameServerId)),
      tap(gameServer => {
        if (!gameServer) {
          this.store.dispatch(loadGameServer({ gameServerId }));
        }
      }),
    )),
    map(gameServer => gameServer?.name),
  );

  isMyGame = this.gameId.pipe(
    switchMap(gameId => this.store.select(isMyGame(gameId))),
  );

  mumbleUrl = this.gameId.pipe(
    switchMap(gameId => this.store.select(mumbleUrl(gameId))),
  );

  scoreBlu = this.gameId.pipe(
    switchMap(gameId => this.store.select(gameScore(gameId, 'blu'))),
  );

  scoreRed = this.gameId.pipe(
    switchMap(gameId => this.store.select(gameScore(gameId, 'red'))),
  );

  isAdmin: Observable<boolean> = this.store.select(isAdmin);
  playersRed: Observable<ResolvedGamePlayer[]>;
  playersBlu: Observable<ResolvedGamePlayer[]>;

  constructor(
    private route: ActivatedRoute,
    private store: Store<{}>,
    private title: Title,
    private gamesService: GamesService,
    private soundPlayerService: SoundPlayerService,
  ) { }

  ngOnInit() {
    this.route.paramMap.pipe(
      map(params => params.get('id')),
      takeUntil(this.destroyed),
    ).subscribe(gameId => this.gameId.next(gameId));

    this.game.pipe(
      takeUntil(this.destroyed),
    ).subscribe(game => this.title.setTitle(`Pickup #${game.number} • ${environment.titleSuffix}`));

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
      switchMap(() => this.gameId),
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
      map(players => this.sortPlayers(players)),
    );

    this.playersBlu = combineLatest([this.players, getTeamId('BLU')]).pipe(
      map(([allPlayers, bluTeamId]) => allPlayers.filter(p => p.teamId === bluTeamId)),
      map(players => this.sortPlayers(players)),
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

  private sortPlayers(players: ResolvedGamePlayer[]): ResolvedGamePlayer[] {
    return players.sort((a, b) => tf2ClassPriority.get(b.gameClass) - tf2ClassPriority.get(a.gameClass));
  }

}
