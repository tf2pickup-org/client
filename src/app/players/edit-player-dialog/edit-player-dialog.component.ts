import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Player } from '../models/player';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Store, select } from '@ngrx/store';
import { AppState } from '@app/app.state';
import { Observable } from 'rxjs';
import { playersLocked, playerById } from '../players.selectors';
import { editPlayer } from '../players.actions';
import { first } from 'rxjs/operators';

interface PlayerSkill {
  gameClass: string;
  value: number;
}

@Component({
  selector: 'app-edit-player-dialog',
  templateUrl: './edit-player-dialog.component.html',
  styleUrls: ['./edit-player-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditPlayerDialogComponent {

  private _player: Player;

  set player(player: Player) {
    this._player = player;
    this.playerNameValue = player.name;
    this.playerSkill = Object.keys(player.skill)
      .map(key => ({
        gameClass: key,
        value: player.skill[key],
      }));
  }

  get player() {
    return this._player;
  }

  playerNameValue: string;
  playerSkill: PlayerSkill[];
  locked: Observable<boolean> = this.store.select(playersLocked);

  constructor(
    public bsModalRef: BsModalRef,
    private store: Store<AppState>,
  ) { }

  save() {
    const editedPlayer = {
      ...this.player,
      name: this.playerNameValue,
      skill: this.playerSkill.reduce((obj, curr) => {
        obj[curr.gameClass] = curr.value;
        return obj;
      }, { }),
    };
    if (JSON.stringify(editedPlayer) !== JSON.stringify(this.player)) {
      this.store.pipe(
        select(playerById(this.player.id)),
        first(player => player && player.name === editedPlayer.name),
      ).subscribe(() => this.bsModalRef.hide());

      this.store.dispatch(editPlayer({ player: editedPlayer }));
    }
  }

}
