import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { first } from 'rxjs/operators';
import { loadOnlinePlayers } from '../actions';
import {
  onlinePlayerCount,
  onlinePlayers,
  onlinePlayersLoaded,
} from '../selectors';

@Component({
  selector: 'app-online-player-list',
  templateUrl: './online-player-list.component.html',
  styleUrls: ['./online-player-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OnlinePlayerListComponent implements OnInit {
  onlinePlayers = this.store.select(onlinePlayers);
  onlinePlayerCount = this.store.select(onlinePlayerCount);

  constructor(private store: Store) {}

  ngOnInit() {
    this.store
      .select(onlinePlayersLoaded)
      .pipe(first())
      // eslint-disable-next-line ngrx/no-store-subscription
      .subscribe(loaded => {
        if (!loaded) {
          this.store.dispatch(loadOnlinePlayers());
        }
      });
  }
}
