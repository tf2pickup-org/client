import { transition, trigger, useAnimation } from '@angular/animations';
import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { fadeIn } from '@app/animations';

@Component({
  selector: 'app-game-summary',
  templateUrl: './game-summary.component.html',
  styleUrls: ['./game-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('fadeIn', [
      transition(':enter', useAnimation(fadeIn)),
    ]),
  ],
})
export class GameSummaryComponent {

  @Input()
  logsUrl: string;

  @Input()
  demoUrl: string;

}
