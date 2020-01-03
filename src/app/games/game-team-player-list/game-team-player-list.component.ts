import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
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

}
