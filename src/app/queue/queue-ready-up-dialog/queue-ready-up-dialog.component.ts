import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '@app/app.state';
import { leaveQueue, readyUp } from '../queue.actions';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-queue-ready-up-dialog',
  templateUrl: './queue-ready-up-dialog.component.html',
  styleUrls: ['./queue-ready-up-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QueueReadyUpDialogComponent {

  constructor(
    private store: Store<AppState>,
    private bsModalRef: BsModalRef,
  ) { }

  leaveQueue() {
    this.store.dispatch(leaveQueue());
    this.bsModalRef.hide();
  }

  confirmReady() {
    this.store.dispatch(readyUp());
    this.bsModalRef.hide();
  }

}
