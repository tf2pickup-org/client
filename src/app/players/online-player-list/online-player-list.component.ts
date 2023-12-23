import { trigger, transition, useAnimation } from '@angular/animations';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { pulsate } from '@app/animations';
import { Store } from '@ngrx/store';
import { first } from 'rxjs/operators';
import { loadOnlinePlayers } from '../actions';
import {
  onlinePlayerCount,
  onlinePlayers,
  onlinePlayersLoaded,
} from '../selectors';
import { onlinePlayerListAnimation } from './online-player-list.animation';

@Component({
  selector: 'app-online-player-list',
  templateUrl: './online-player-list.component.html',
  styleUrls: ['./online-player-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    onlinePlayerListAnimation,
    trigger('pulsate', [transition(':increment', useAnimation(pulsate))]),
  ],
})
export class OnlinePlayerListComponent implements OnInit {
  onlinePlayers = this.store.select(onlinePlayers);
  onlinePlayerCount = this.store.select(onlinePlayerCount);

  constructor(private store: Store) {}

  ngOnInit() {
    this.store
      .select(onlinePlayersLoaded)
      .pipe(first())
      .subscribe(loaded => {
        if (!loaded) {
          this.store.dispatch(loadOnlinePlayers());
        }
      });
  }
}
