import { Component, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';

// eslint-disable-next-line no-shadow
export enum QueueReadyUpAction {
  readyUp,
  leaveQueue,
};

@Component({
  selector: 'app-queue-ready-up-dialog',
  templateUrl: './queue-ready-up-dialog.component.html',
  styleUrls: ['./queue-ready-up-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QueueReadyUpDialogComponent {

  @Output()
  action = new EventEmitter<QueueReadyUpAction>();

  readyUp() {
    this.action.emit(QueueReadyUpAction.readyUp);
  }

  leaveQueue() {
    this.action.emit(QueueReadyUpAction.leaveQueue);
  }

}
