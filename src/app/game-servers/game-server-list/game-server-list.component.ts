import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  allGameServers,
  gameServersLoaded,
  gameServersLocked,
} from '../game-servers.selectors';
import { first } from 'rxjs/operators';
import { loadGameServers } from '../game-servers.actions';
import { isSuperUser } from '@app/profile/profile.selectors';

@Component({
  selector: 'app-game-server-list',
  templateUrl: './game-server-list.component.html',
  styleUrls: ['./game-server-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameServerListComponent implements OnInit {
  servers = this.store.select(allGameServers);
  isSuperUser = this.store.select(isSuperUser);
  locked = this.store.select(gameServersLocked);

  constructor(private store: Store) {}

  ngOnInit() {
    // TODO move loading game servers to the router
    this.store
      .select(gameServersLoaded)
      .pipe(first())
      .subscribe(loaded => {
        if (!loaded) {
          this.store.dispatch(loadGameServers());
        }
      });
  }
}
