import { KeyValue } from '@angular/common';
import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { Tf2ClassName } from '@app/shared/models/tf2-class-name';
import { tf2ClassOrder } from '@app/shared/tf2-class-order';
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

  // skipcq: JS-0105
  orderGameClasses = (
    a: KeyValue<Tf2ClassName, number>,
    b: KeyValue<Tf2ClassName, number>,
  ): number => tf2ClassOrder[b.key] - tf2ClassOrder[a.key];
}
