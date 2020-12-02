import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-game-admin-buttons',
  templateUrl: './game-admin-buttons.component.html',
  styleUrls: ['./game-admin-buttons.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameAdminButtonsComponent {

  @Output()
  reinitializeServer = new EventEmitter<void>();

  @Output()
  forceEnd = new EventEmitter<void>();

}
