import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'app-join-game-info',
  templateUrl: './join-game-info.component.html',
  styleUrls: ['./join-game-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JoinGameInfoComponent {

  @Input()
  mumbleUrl: string;

  @Input()
  connectString: string;

}
