import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { GameServer } from '../models/game-server';
import { Store, select } from '@ngrx/store';
import { AppState } from '@app/app.state';
import { addGameServer } from '../game-servers.actions';
import { Observable } from 'rxjs';
import { gameServersLocked, gameServerByName } from '../game-servers.selectors';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-add-game-server-dialog',
  templateUrl: './add-game-server-dialog.component.html',
  styleUrls: ['./add-game-server-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddGameServerDialogComponent {

  serverNameValue: string;
  addressValue: string;
  portValue = 27015;
  rconPasswordValue: string;
  locked: Observable<boolean> = this.store.select(gameServersLocked);

  constructor(
    public bsModalRef: BsModalRef,
    private store: Store<AppState>,
  ) { }

  add() {
    const gameServer: GameServer = {
      name: this.serverNameValue,
      address: this.addressValue,
      port: this.portValue,
      rconPassword: this.rconPasswordValue,
    };

    this.store.pipe(
      select(gameServerByName(gameServer.name)),
      first(),
    ).subscribe(() => this.bsModalRef.hide());

    this.store.dispatch(addGameServer({ gameServer }));
  }

}
