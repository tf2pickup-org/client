import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '@app/app.state';
import { Observable } from 'rxjs';
import { GameServer } from '../models/game-server';
import { allGameServers, gameServersLoaded, gameServersLocked } from '../game-servers.selectors';
import { first, map } from 'rxjs/operators';
import { loadGameServers, removeGameServer } from '../game-servers.actions';
import { profile } from '@app/profile/profile.selectors';
import { BsModalService } from 'ngx-bootstrap/modal';
import { AddGameServerDialogComponent } from '../add-game-server-dialog/add-game-server-dialog.component';
import { Title } from '@angular/platform-browser';
import { environment } from '@environment';

@Component({
  selector: 'app-game-server-list',
  templateUrl: './game-server-list.component.html',
  styleUrls: ['./game-server-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameServerListComponent implements OnInit {

  servers: Observable<GameServer[]> = this.store.select(allGameServers);
  isSuperUser: Observable<boolean> = this.store.pipe(
    select(profile),
    map(theProfile => theProfile && theProfile.role === 'super-user'),
  );
  locked: Observable<boolean> = this.store.select(gameServersLocked);

  constructor(
    private store: Store<AppState>,
    private modalService: BsModalService,
    private title: Title,
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

    this.title.setTitle(`servers • ${environment.titleSuffix}`);
  }

  addGameServer() {
    this.modalService.show(AddGameServerDialogComponent);
  }

  removeGameServer(server: GameServer) {
    this.store.dispatch(removeGameServer({ gameServerId: server.id }));
  }

}
