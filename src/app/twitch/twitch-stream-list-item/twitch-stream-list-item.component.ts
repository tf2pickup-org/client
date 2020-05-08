import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { TwitchStream } from '../models/twitch-stream';

@Component({
  selector: 'app-twitch-stream-list-item',
  templateUrl: './twitch-stream-list-item.component.html',
  styleUrls: ['./twitch-stream-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TwitchStreamListItemComponent {

  @Input()
  stream: TwitchStream;

}
