import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '@app/app.state';
import { Observable } from 'rxjs';
import { activeGame } from '@app/games/games.selectors';
import { Game } from '@app/games/models/game';

@Component({
  selector: 'app-queue-container',
  templateUrl: './queue-container.component.html',
  styleUrls: ['./queue-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QueueContainerComponent {

  activeGame: Observable<Game> = this.store.select(activeGame);

  constructor(
    private store: Store<AppState>,
  ) { }

}
