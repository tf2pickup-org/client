import { animate, style, transition, trigger, useAnimation } from '@angular/animations';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { pulsate } from '@app/animations';
import { Store } from '@ngrx/store';
import { queueCurrentPlayerCount, queueRequiredPlayerCount, queueState, isInQueue } from '../queue.selectors';

@Component({
  selector: 'app-queue-status',
  templateUrl: './queue-status.component.html',
  styleUrls: ['./queue-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('250ms ease-out', style({ opacity: 1 })),
      ]),
    ]),
    trigger('pulsate', [
      transition(':increment', useAnimation(pulsate)),
    ]),
  ],
})
export class QueueStatusComponent {

  playerCount = this.store.select(queueCurrentPlayerCount);
  requiredPlayerCount = this.store.select(queueRequiredPlayerCount);
  state = this.store.select(queueState);
  isInQueue = this.store.select(isInQueue);

  constructor(
    private store: Store,
  ) { }

}
