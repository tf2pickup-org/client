import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { playerById } from '../selectors';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-player-avatar',
  templateUrl: './player-avatar.component.html',
  styleUrls: ['./player-avatar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerAvatarComponent {

  url: Observable<string>;

  @Input()
  set playerId(playerId: string) {
    this.url = this.store.pipe(
      select(playerById(playerId)),
      filter(player => !!player),
      map(player => player.avatarUrl),
    );
  }

  constructor(
    private store: Store,
  ) { }

}
