import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { queueClasses } from '../queue.selectors';

@Component({
  selector: 'app-queue',
  templateUrl: './queue.component.html',
  styleUrls: ['./queue.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QueueComponent {

  queueClasses = this.store.select(queueClasses);

  constructor(
    private store: Store<{}>,
  ) { }

}
