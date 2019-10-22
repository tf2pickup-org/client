import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '@app/app.state';
import { Observable, Subject, ReplaySubject, combineLatest } from 'rxjs';
import { Game } from '../models/game';
import { ActivatedRoute } from '@angular/router';
import { switchMap, map, tap, filter, first, pairwise, withLatestFrom, shareReplay, takeUntil, defaultIfEmpty, startWith } from 'rxjs/operators';
import { gameById } from '../games.selectors';
import { loadGame, forceEndGame, reinitializeServer } from '../games.actions';
import { Player } from '@app/players/models/player';
import { playerById } from '@app/players/selectors';
import { loadPlayer } from '@app/players/actions';
import { profile } from '@app/profile/profile.selectors';
import { Title } from '@angular/platform-browser';
import { environment } from '@environment';
import { GamePlayer } from '../models/game-player';
import { GamesService } from '../games.service';

type ResolvedGamePlayer = Player & GamePlayer & { classSkill?: number };

@Component({
  selector: 'app-game-details',
  templateUrl: './game-details.component.html',
  styleUrls: ['./game-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameDetailsComponent implements OnInit, OnDestroy {

  private destroyed = new Subject<void>();
  private audio = new Audio('/assets/sounds/fight.wav');
  private players = new ReplaySubject<ResolvedGamePlayer[]>(1);
  game: Observable<Game>;
  playersRed: Observable<ResolvedGamePlayer[]>;
  playersBlu: Observable<ResolvedGamePlayer[]>;
  isAdmin: Observable<boolean> = this.store.pipe(
    select(profile),
    map(theProfile => theProfile && (theProfile.role === 'super-user' || theProfile.role === 'admin')),
  );

  @ViewChild('connectInput', { static: false })
  connectInput: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private title: Title,
    private gamesService: GamesService,
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
      switchMap(game => combineLatest([
        ...game.slots.map(slot => resolveGamePlayer(slot))
      ])));

    const resolveSkills = this.isAdmin.pipe(
      filter(isAdmin => isAdmin),
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
      this.audio.play();
      const notification = new Notification('Join the game', {
        body: 'The server is ready. Join the game!',
      });
    });
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.unsubscribe();
  }

  copyConnectString() {
    const input = this.connectInput.nativeElement as HTMLInputElement;
    input.focus();
    input.select();
    document.execCommand('copy');
  }

  reinitializeServer() {
    this.game.pipe(
      first(),
    ).subscribe(game => this.store.dispatch(reinitializeServer({ gameId: game.id  })));
  }

  forceEndGame() {
    this.game.pipe(
      first(),
    ).subscribe(game => this.store.dispatch(forceEndGame({ gameId: game.id })));
  }

}
