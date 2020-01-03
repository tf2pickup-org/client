import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'app-game-basic-info',
  templateUrl: './game-basic-info.component.html',
  styleUrls: ['./game-basic-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameBasicInfoComponent {

  @Input()
  launchedAt: Date;

  @Input()
  map: string;

  @Input()
  gameServerName: string;

  @Input()
  state: string;

  @Input()
  error: string;

}
