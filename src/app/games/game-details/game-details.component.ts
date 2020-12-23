import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { map, filter, pairwise, takeUntil } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';
import { environment } from '@environment';
import { GameDetailsStore } from './game-details.store';
import { Howl } from 'howler';

@Component({
  selector: 'app-game-details',
  templateUrl: './game-details.component.html',
  styleUrls: ['./game-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ GameDetailsStore ],
})
export class GameDetailsComponent implements OnInit, OnDestroy {

  private destroyed = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private title: Title,
    public readonly store: GameDetailsStore,
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
    ).subscribe(() => {
      new Howl({
        src: ['webm', 'wav'].map(format => `/assets/sounds/fight.${format}`),
        autoplay: true,
      });
    });
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
