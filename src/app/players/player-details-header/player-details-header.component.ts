import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { Player } from '../models/player';

@Component({
  selector: 'app-player-details-header',
  templateUrl: './player-details-header.component.html',
  styleUrls: ['./player-details-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerDetailsHeaderComponent {
  @Input()
  player: Player;
}
