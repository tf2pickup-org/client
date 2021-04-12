import {
  Component,
  ChangeDetectionStrategy,
  Input,
  HostBinding,
} from '@angular/core';
import { PlayerConnectionStatus } from '../models/player-connection-status';

const connectionStatusToIndicator: Record<PlayerConnectionStatus, string> = {
  connected: 'indicator--online',
  offline: 'indicator--offline',
  joining: 'indicator--warning',
};

@Component({
  selector: 'app-player-connection-status',
  templateUrl: './player-connection-status.component.html',
  styleUrls: ['./player-connection-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerConnectionStatusComponent {
  @Input()
  connectionStatus: PlayerConnectionStatus;

  @HostBinding('class')
  get className() {
    return `indicator ${connectionStatusToIndicator[this.connectionStatus]}`;
  }
}
