import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { QueuePlayer } from '../models/queue-player';
import { AppState } from 'src/app/app.state';
import { Store, select } from '@ngrx/store';
import { queueSlotPlayers } from '../queue.selectors';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-queue-player-list',
  templateUrl: './queue-player-list.component.html',
  styleUrls: ['./queue-player-list.component.scss']
})
export class QueuePlayerListComponent {

  players: Observable<string[]>;

  @Input()
  set slot(slot: string) {
    this.players = this.store.pipe(
      select(queueSlotPlayers(slot)),
      map(ps => ps.map(p => p.playerId)),
    );
  }

  constructor(
    private store: Store<AppState>,
  ) { }

}
