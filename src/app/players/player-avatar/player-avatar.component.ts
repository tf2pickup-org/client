import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { playerById } from '../selectors';
import { filter, map } from 'rxjs/operators';
import { PlayerAvatar } from '../models/player-avatar';

@Component({
  selector: 'app-player-avatar',
  templateUrl: './player-avatar.component.html',
  styleUrls: ['./player-avatar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerAvatarComponent {
  @Input()
  size: keyof PlayerAvatar = 'small';

  url: Observable<string>;
  private _playerId: string;

  @Input()
  set playerId(playerId: string) {
    this._playerId = playerId;
    this.url = this.store.select(playerById(playerId)).pipe(
      filter(player => Boolean(player)),
      map(player => player.avatar[this.size]),
    );
  }

  get playerId() {
    return this._playerId;
  }

  constructor(private store: Store) {}
}
