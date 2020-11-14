import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { GameServer } from '../models/game-server';
import { allGameServers, gameServersLoaded, gameServersLocked } from '../game-servers.selectors';
import { first } from 'rxjs/operators';
import { loadGameServers, removeGameServer } from '../game-servers.actions';
import { isSuperUser } from '@app/profile/profile.selectors';
import { BsModalService } from 'ngx-bootstrap/modal';
import { AddGameServerDialogComponent } from '../add-game-server-dialog/add-game-server-dialog.component';

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

  constructor(
    private store: Store,
    private modalService: BsModalService,
  ) { }

  ngOnInit() {
    this.store.pipe(
      select(gameServersLoaded),
      first(),
    ).subscribe(loaded => {
      if (!loaded) {
        this.store.dispatch(loadGameServers());
      }
    });
  }

  addGameServer() {
    this.modalService.show(AddGameServerDialogComponent);
  }

  removeGameServer(server: GameServer) {
    this.store.dispatch(removeGameServer({ gameServerId: server.id }));
  }

}
