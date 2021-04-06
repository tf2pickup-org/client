import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { Player } from '../models/player';

@Component({
  selector: 'app-player-details-badges',
  templateUrl: './player-details-badges.component.html',
  styleUrls: ['./player-details-badges.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerDetailsBadgesComponent {
  @Input()
  player: Player;
}
