import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, tap, switchMap, takeUntil, filter } from 'rxjs/operators';
import { PlayerBan } from '../models/player-ban';
import { Observable, Subject } from 'rxjs';
import { Player } from '../models/player';
import { Store } from '@ngrx/store';
import { playerById, playerBans } from '../selectors';
import { loadPlayer, revokePlayerBan, loadPlayerBans } from '../actions';
import { Location } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { environment } from '@environment';

@Component({
  selector: 'app-player-bans',
  templateUrl: './player-bans.component.html',
  styleUrls: ['./player-bans.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerBansComponent implements OnInit, OnDestroy {
  player: Observable<Player>;
  bans: Observable<PlayerBan[]>;
  private destroyed = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private store: Store,
    private location: Location,
    private title: Title,
  ) {}

  ngOnInit() {
    const getPlayerId = this.route.paramMap.pipe(
      map(params => params.get('id')),
    );

    this.player = getPlayerId.pipe(
      switchMap(playerId =>
        this.store.select(playerById(playerId)).pipe(
          tap(player => {
            if (!player) {
              this.store.dispatch(loadPlayer({ playerId }));
            }
          }),
        ),
      ),
      filter(player => !!player),
      tap(player =>
        this.title.setTitle(`${player.name} bans • ${environment.titleSuffix}`),
      ),
    );

    getPlayerId
      .pipe(takeUntil(this.destroyed))
      .subscribe(playerId => this.store.dispatch(loadPlayerBans({ playerId })));

    this.bans = getPlayerId.pipe(
      switchMap(playerId => this.store.select(playerBans(playerId))),
    );
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.unsubscribe();
  }

  cancel() {
    this.location.back();
  }

  revoke(playerBan: PlayerBan) {
    this.store.dispatch(revokePlayerBan({ playerBan }));
  }
}
