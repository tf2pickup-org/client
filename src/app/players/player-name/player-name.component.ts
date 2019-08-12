import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '@app/app.state';
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

  @Input()
  set playerId(playerId: string) {
    if (!playerId) {
      return;
    }

    this.name = this.store.pipe(
      select(playerById(playerId)),
      tap(player => {
        if (!player) {
          this.store.dispatch(loadPlayer({ playerId }));
        }
      }),
      filter(player => !!player),
      map(player => player.name),
    );
  }

  constructor(
    private store: Store<AppState>,
  ) { }

}
