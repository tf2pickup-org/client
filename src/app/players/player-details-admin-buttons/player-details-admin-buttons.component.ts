import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'app-player-details-admin-buttons',
  templateUrl: './player-details-admin-buttons.component.html',
  styleUrls: ['./player-details-admin-buttons.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerDetailsAdminButtonsComponent {

  @Input()
  playerId: string;

}
