import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'app-game-team-header',
  templateUrl: './game-team-header.component.html',
  styleUrls: ['./game-team-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameTeamHeaderComponent {

  @Input()
  team: 'red' | 'blu';

  @Input()
  score: number;

}
