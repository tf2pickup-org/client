import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { Player } from '../models/player';

@Component({
  selector: 'app-player-details-external-profile-links',
  templateUrl: './player-details-external-profile-links.component.html',
  styleUrls: ['./player-details-external-profile-links.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerDetailsExternalProfileLinksComponent {

  @Input()
  player: Player;

}
