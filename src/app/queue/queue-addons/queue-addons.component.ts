import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '@app/app.state';
import { isInQueue } from '../queue.selectors';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-queue-addons',
  templateUrl: './queue-addons.component.html',
  styleUrls: ['./queue-addons.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QueueAddonsComponent {

  isInQueue = this.store.select(isInQueue).pipe(debounceTime(100));

  constructor(
    private store: Store<AppState>,
  ) { }

}
