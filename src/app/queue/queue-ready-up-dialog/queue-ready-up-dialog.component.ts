import { Component, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-queue-ready-up-dialog',
  templateUrl: './queue-ready-up-dialog.component.html',
  styleUrls: ['./queue-ready-up-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QueueReadyUpDialogComponent {

  @Output()
  leaveQueue = new EventEmitter<void>();

  @Output()
  readyUp = new EventEmitter<void>();

}
