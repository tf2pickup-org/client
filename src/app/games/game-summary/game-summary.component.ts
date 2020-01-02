import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'app-game-summary',
  templateUrl: './game-summary.component.html',
  styleUrls: ['./game-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameSummaryComponent {

  @Input()
  logsUrl: string;

  @Input()
  demoUrl: string;

}
