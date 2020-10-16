import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { GameServer } from '../models/game-server';
import { allGameServers, gameServersLoaded } from '../game-servers.selectors';
import { first } from 'rxjs/operators';
import { loadGameServers, removeGameServer } from '../game-servers.actions';
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

  constructor(
    private store: Store,
  ) { }

  ngOnInit() {
    // TODO move loading game servers to the router
    this.store.pipe(
      select(gameServersLoaded),
      first(),
    ).subscribe(loaded => {
      if (!loaded) {
        this.store.dispatch(loadGameServers());
      }
    });
  }

  removeGameServer(server: GameServer) {
    this.store.dispatch(removeGameServer({ gameServerId: server.id }));
  }

}
