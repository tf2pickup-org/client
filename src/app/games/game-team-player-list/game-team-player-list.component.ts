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

  @Input()
  locked = false;

  @Output()
  requestSubstitute = new EventEmitter<string>();

  @Output()
  replacePlayer = new EventEmitter<string>();

  emitRequestSubstitute(event: Event, player: ResolvedGamePlayer) {
    event.preventDefault();
    event.stopPropagation();
    this.requestSubstitute.emit(player.id);
  }

  emitReplacePlayer(player: ResolvedGamePlayer) {
    this.replacePlayer.emit(player.id);
  }

}
