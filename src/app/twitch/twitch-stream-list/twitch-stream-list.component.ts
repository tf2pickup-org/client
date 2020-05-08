import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { twitchStreams } from '../twitch.selectors';

@Component({
  selector: 'app-twitch-stream-list',
  templateUrl: './twitch-stream-list.component.html',
  styleUrls: ['./twitch-stream-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TwitchStreamListComponent {

  streams = this.store.select(twitchStreams);

  constructor(
    private store: Store,
  ) { }

}
