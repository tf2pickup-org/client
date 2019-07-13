import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { queueClasses } from '../queue.selectors';
import { GameClass } from '../models/game-class';

@Component({
  selector: 'app-queue',
  templateUrl: './queue.component.html',
  styleUrls: ['./queue.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QueueComponent {

  queueClasses: Observable<GameClass[]> = this.store.select(queueClasses);

  constructor(
    private store: Store<AppState>,
  ) { }

}
