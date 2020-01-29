import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'app-watch-game-info',
  templateUrl: './watch-game-info.component.html',
  styleUrls: ['./watch-game-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WatchGameInfoComponent {

  @Input()
  stvConnectString: string;

}
