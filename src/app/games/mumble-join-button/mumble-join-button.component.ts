import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'app-mumble-join-button',
  templateUrl: './mumble-join-button.component.html',
  styleUrls: ['./mumble-join-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MumbleJoinButtonComponent {
  @Input()
  mumbleUrl: string;
}
