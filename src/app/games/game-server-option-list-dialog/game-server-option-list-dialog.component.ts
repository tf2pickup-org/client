import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { GameServersService } from '@app/game-servers/game-servers.service';
import { GameServerOption } from '@app/game-servers/models/game-server-option';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-game-server-option-list-dialog',
  templateUrl: './game-server-option-list-dialog.component.html',
  styleUrls: ['./game-server-option-list-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameServerOptionListDialogComponent {
  options: Observable<GameServerOption[]> =
    this.gameServersService.fetchGameServerOptions();

  constructor(private readonly gameServersService: GameServersService) {}

  @Output()
  readonly optionSelect = new EventEmitter<GameServerOption>();
}
