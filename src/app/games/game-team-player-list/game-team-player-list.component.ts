import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { ResolvedGamePlayer } from '../models/resolved-game-player';

@Component({
  selector: 'app-game-team-player-list',
  templateUrl: './game-team-player-list.component.html',
  styleUrls: ['./game-team-player-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameTeamPlayerListComponent {

  @Input()
  players: ResolvedGamePlayer[];

  @Input()
  team: 'blu' | 'red';

  @Input()
  showPlayerConnectionStatus = false;

  @Input()
  showAdminActionButtons = false;

  @Output()
  requestSubstituteToggle = new EventEmitter<string>();

  emitRequestSubstituteToggle(event: Event, player: ResolvedGamePlayer) {
    event.preventDefault();
    event.stopPropagation();
    this.requestSubstituteToggle.emit(player.id);
  }

}
