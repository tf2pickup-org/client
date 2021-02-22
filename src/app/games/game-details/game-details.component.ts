import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { map, filter, pairwise, takeUntil, mergeMap } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';
import { environment } from '@environment';
import { GameDetailsStore } from './game-details.store';
import { SoundPlayerService } from '@app/shared/sound-player.service';
import { Tf2Team } from '../models/tf2-team';

@Component({
  selector: 'app-game-details',
  templateUrl: './game-details.component.html',
  styleUrls: ['./game-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ GameDetailsStore ],
})
export class GameDetailsComponent implements OnInit, OnDestroy {

  readonly teams: Tf2Team[] = ['blu', 'red'];

  private destroyed = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private title: Title,
    public readonly store: GameDetailsStore,
    private soundPlayerService: SoundPlayerService,
  ) { }

  ngOnInit() {
    this.route.paramMap.pipe(
      map(params => params.get('id')),
      takeUntil(this.destroyed),
    ).subscribe(gameId => this.store.setGameId(gameId));

    this.store.game.pipe(
      filter(game => !!game),
      takeUntil(this.destroyed),
    ).subscribe(game => this.title.setTitle(`Pickup #${game.number} • ${environment.titleSuffix}`));

    // play sound when the connect is available
    this.store.game.pipe(
      filter(game => !!game),
      map(game => game.connectString),
      pairwise(),
      filter(([a, b])  => !a && !!b),
      takeUntil(this.destroyed),
      mergeMap(() => this.soundPlayerService.playSound(['webm', 'wav'].map(format => `/assets/sounds/fight.${format}`))),
    ).subscribe();
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.unsubscribe();
  }

  reinitializeServer() {
    this.store.reinitializeServer();
  }

  forceEnd() {
    this.store.forceEnd();
  }

  requestSubstitute(playerId: string) {
    this.store.requestSubstitute(playerId);
  }

  replacePlayer(replaceeId: string) {
    this.store.replacePlayer(replaceeId);
  }

}
