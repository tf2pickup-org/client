import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'app-join-voice-button',
  templateUrl: './join-voice-button.component.html',
  styleUrls: ['./join-voice-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JoinVoiceButtonComponent {
  @Input()
  mumbleUrl: string;
}
