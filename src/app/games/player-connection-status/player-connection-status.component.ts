import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { PlayerConnectionStatus } from '../models/player-connection-status';

@Component({
  selector: 'app-player-connection-status',
  templateUrl: './player-connection-status.component.html',
  styleUrls: ['./player-connection-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerConnectionStatusComponent {

  @Input()
  connectionStatus: PlayerConnectionStatus;

}
