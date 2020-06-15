import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { Tf2Team } from '../models/tf2-team';

@Component({
  selector: 'app-game-team-header',
  templateUrl: './game-team-header.component.html',
  styleUrls: ['./game-team-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameTeamHeaderComponent {

  @Input()
  team: Tf2Team;

  @Input()
  score: number;

}
