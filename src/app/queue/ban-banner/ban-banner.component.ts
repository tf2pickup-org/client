import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { PlayerBan } from '@app/players/models/player-ban';

@Component({
  selector: 'app-ban-banner',
  templateUrl: './ban-banner.component.html',
  styleUrls: ['./ban-banner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BanBannerComponent {
  @Input()
  ban: PlayerBan;
}
