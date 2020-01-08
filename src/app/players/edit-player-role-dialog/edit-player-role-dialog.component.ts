import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Player } from '../models/player';
import { PlayerRole } from '../models/player-role';
import { Store, select } from '@ngrx/store';
import { AppState } from '@app/app.state';
import { playersLocked, playerById } from '../selectors';
import { filter, first, tap } from 'rxjs/operators';
import { setPlayerRole } from '../actions';

@Component({
  selector: 'app-edit-player-role-dialog',
  templateUrl: './edit-player-role-dialog.component.html',
  styleUrls: ['./edit-player-role-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditPlayerRoleDialogComponent {

  readonly roles = [
    { text: 'no role', value: 'no role' },
    { text: 'admin', value: 'admin' },
    { text: 'super user', value: 'super-user' },
  ];

  selectedRole: PlayerRole | 'no role';
  locked = this.store.select(playersLocked);
  private _player: Player;

  set player(player: Player) {
    this._player = player;
    this.selectedRole = player.role ?? 'no role';
  }

  constructor(
    public bsModalRef: BsModalRef,
    private store: Store<AppState>,
  ) { }

  saveRole() {
    console.log(this.selectedRole);
    this.store.pipe(
      select(playerById(this._player.id)),
      filter(p => p.role === this.selectedRole),
      first(),
    ).subscribe(() => this.bsModalRef.hide());

    this.store.dispatch(setPlayerRole({ playerId: this._player.id, role: this.selectedRole === 'no role' ? null : this.selectedRole }));
  }

}
