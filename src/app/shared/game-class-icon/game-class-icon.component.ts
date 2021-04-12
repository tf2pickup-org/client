import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'app-game-class-icon',
  templateUrl: './game-class-icon.component.html',
  styleUrls: ['./game-class-icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameClassIconComponent {
  @Input()
  gameClass: string;

  @Input()
  size = 30;
}
