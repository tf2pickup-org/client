import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PlayerActionsFilter } from '../models/player-actions-filter';
import { PlayerActionLogsStore } from './player-action-logs.store';

@Component({
  selector: 'app-player-action-logs',
  templateUrl: './player-action-logs.component.html',
  styleUrls: ['./player-action-logs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [PlayerActionLogsStore],
})
export class PlayerActionLogsComponent {
  constructor(public readonly store: PlayerActionLogsStore) {}

  updateFilter(key: keyof PlayerActionsFilter, value: string) {
    this.store.setFilter({ key, value });
  }
}
