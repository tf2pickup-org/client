import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { Player } from 'src/app/player/models/player';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { playerById } from 'src/app/player/player.selectors';
import { tap } from 'rxjs/operators';
import { loadPlayer } from '@app/player/player.actions';

@Component({
  selector: 'app-queue-player-list-item',
  templateUrl: './queue-player-list-item.component.html',
  styleUrls: ['./queue-player-list-item.component.scss']
})
export class QueuePlayerListItemComponent {

  player: Observable<Player>;

  @Input()
  set playerId(playerId: string) {
    this.player = this.store.pipe(
      select(playerById(playerId)),
      tap(player => {
        console.log(player);
        if (!player) {
          this.store.dispatch(loadPlayer({ playerId }));
        }
      })
    );
  }

  constructor(
    private store: Store<AppState>,
  ) { }

}
