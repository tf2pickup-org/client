import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { PlayerBan } from '../models/player-ban';

@Component({
  selector: 'app-player-ban-item',
  templateUrl: './player-ban-item.component.html',
  styleUrls: ['./player-ban-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerBanItemComponent {
  @Input()
  playerBan: PlayerBan;

  @Output()
  revoke = new EventEmitter<void>();

  isExpired() {
    return new Date(this.playerBan.end) < new Date();
  }
}
