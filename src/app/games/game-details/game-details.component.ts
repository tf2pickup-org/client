import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
} from '@angular/core';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { map, filter, takeUntil, mergeMap, pairwise } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';
import { environment } from '@environment';
import { GameDetailsStore } from './game-details.store';
import { SoundPlayerService } from '@app/shared/sound-player.service';
import { Tf2Team } from '../models/tf2-team';
import { GameServerOption } from '@app/game-servers/models/game-server-option';

@Component({
  selector: 'app-game-details',
  templateUrl: './game-details.component.html',
  styleUrls: ['./game-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [GameDetailsStore],
})
export class GameDetailsComponent implements OnInit, OnDestroy {
  readonly teams: Tf2Team[] = ['blu', 'red'];

  private destroyed = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private title: Title,
    public readonly store: GameDetailsStore,
    private soundPlayerService: SoundPlayerService,
  ) {}

  ngOnInit() {
    this.route.paramMap
      .pipe(
        map(params => params.get('id')),
        takeUntil(this.destroyed),
      )
      .subscribe(gameId => this.store.setGameId(gameId));

    this.store.game
      .pipe(filter(Boolean), takeUntil(this.destroyed))
      .subscribe(game =>
        this.title.setTitle(
          `Pickup #${game.number} • ${environment.titleSuffix}`,
        ),
      );

    // play sound when the connect is available
    this.store.connectString
      .pipe(
        pairwise(),
        // undefined means we didn't fetch the connect info yet
        // null means the connect info isn't available yet
        filter(([a, b]) => a !== undefined && Boolean(b)),
        takeUntil(this.destroyed),
        mergeMap(() =>
          this.soundPlayerService.playSound(
            ['webm', 'wav'].map(format => `/assets/sounds/fight.${format}`),
          ),
        ),
      )
      .subscribe();
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

  reassign(gameServer: GameServerOption) {
    this.store.reassign(gameServer);
  }

  requestSubstitute(playerId: string) {
    this.store.requestSubstitute(playerId);
  }

  replacePlayer(replaceeId: string) {
    this.store.replacePlayer(replaceeId);
  }
}
