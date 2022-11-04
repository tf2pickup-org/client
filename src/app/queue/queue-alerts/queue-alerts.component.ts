import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  activeGameId,
  bans,
  restrictions,
} from '@app/profile/profile.selectors';
import { substituteRequests } from '../queue.selectors';

@Component({
  selector: 'app-queue-alerts',
  templateUrl: './queue-alerts.component.html',
  styleUrls: ['./queue-alerts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QueueAlertsComponent {
  activeGameId = this.store.select(activeGameId);
  bans = this.store.select(bans);
  substituteRequests = this.store.select(substituteRequests);
  restrictions = this.store.select(restrictions);

  constructor(private readonly store: Store) {}
}
