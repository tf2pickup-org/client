import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { GameServerOption } from '@app/game-servers/models/game-server-option';

@Component({
  selector: 'app-game-server-option-list',
  templateUrl: './game-server-option-list.component.html',
  styleUrls: ['./game-server-option-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameServerOptionListComponent {
  @Input()
  gameServerOptions: GameServerOption[];

  @Output()
  readonly optionSelect = new EventEmitter<GameServerOption>();
}
