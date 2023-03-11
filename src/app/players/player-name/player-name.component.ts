import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { playerById } from '../selectors';
import { tap, map, filter } from 'rxjs/operators';
import { loadPlayer } from '../actions';

@Component({
  selector: 'app-player-name',
  templateUrl: './player-name.component.html',
  styleUrls: ['./player-name.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerNameComponent {
  name: Observable<string>;
  private _playerId: string;

  @Input()
  set playerId(playerId: string) {
    this._playerId = playerId;
    if (!playerId) {
      return;
    }

    this.name = this.store.select(playerById(playerId)).pipe(
      tap(player => {
        if (!player) {
          this.store.dispatch(loadPlayer({ playerId }));
        }
      }),
      filter(player => Boolean(player)),
      map(player => player.name),
    );
  }

  get playerId() {
    return this._playerId;
  }

  constructor(private store: Store) {}
}
