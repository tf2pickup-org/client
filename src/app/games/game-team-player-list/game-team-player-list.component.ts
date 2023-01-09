import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { Player } from '@app/players/models/player';
import { GameSlot } from '../models/game-slot';

@Component({
  selector: 'app-game-team-player-list',
  templateUrl: './game-team-player-list.component.html',
  styleUrls: ['./game-team-player-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameTeamPlayerListComponent {
  @Input()
  slots: GameSlot[];

  @Input()
  showPlayerConnectionStatus = false;

  @Input()
  showAdminActionButtons = false;

  @Input()
  showAssignedSkills = false;

  @Input()
  locked = false;

  @Output()
  readonly requestSubstitute = new EventEmitter<string>();

  @Output()
  readonly replacePlayer = new EventEmitter<string>();

  emitRequestSubstitute(event: Event, player: Player) {
    event.preventDefault();
    event.stopPropagation();
    this.requestSubstitute.emit(player.id);
  }

  emitReplacePlayer(player: Player) {
    this.replacePlayer.emit(player.id);
  }
}
