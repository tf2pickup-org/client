import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { PlayerStats } from '../models/player-stats';

@Component({
  selector: 'app-player-stats',
  templateUrl: './player-stats.component.html',
  styleUrls: ['./player-stats.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerStatsComponent {
  @Input()
  playerStats: PlayerStats;
}
