import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { AppState } from 'src/app/app.state';
import { Store, select } from '@ngrx/store';
import { queueSlotPlayers } from '../queue.selectors';
import { map } from 'rxjs/operators';
import { AuthService } from '@app/auth/auth.service';

@Component({
  selector: 'app-queue-player-list',
  templateUrl: './queue-player-list.component.html',
  styleUrls: ['./queue-player-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QueuePlayerListComponent {

  private _slot: string;
  authenticated = this.authService.authenticated;
  players: Observable<string[]>;

  @Input()
  set slot(slot: string) {
    this._slot = slot;
    this.players = this.store.pipe(
      select(queueSlotPlayers(slot)),
      map(ps => ps.map(p => p.playerId)),
    );
  }

  get slot() {
    return this._slot;
  }

  constructor(
    private store: Store<AppState>,
    private authService: AuthService,
  ) { }

}
