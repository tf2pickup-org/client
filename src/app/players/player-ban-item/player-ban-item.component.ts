import { Component, ChangeDetectionStrategy, Input, HostBinding, Output, EventEmitter } from '@angular/core';
import { PlayerBan } from '../models/player-ban';

@Component({
  selector: 'app-player-ban-item',
  templateUrl: './player-ban-item.component.html',
  styleUrls: ['./player-ban-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerBanItemComponent {

  @Input()
  set playerBan(playerBan: PlayerBan) {
    this._playerBan = playerBan;
    this.expired = new Date(playerBan.end) < new Date();
  }

  get playerBan() {
    return this._playerBan;
  }

  @HostBinding('class.bg-light')
  expired: boolean;

  @Output()
  revoke = new EventEmitter<PlayerBan>();

  private _playerBan: PlayerBan;

}
