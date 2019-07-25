import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Store, select } from '@ngrx/store';
import { AppState } from '@app/app.state';
import { takeUntil } from 'rxjs/operators';
import { QueueReadyUpDialogComponent } from '../queue-ready-up-dialog/queue-ready-up-dialog.component';
import { queueShowReadyUpDialog } from '../queue.selectors';

@Component({
  selector: 'app-queue-ready-up-dialog-controller',
  templateUrl: './queue-ready-up-dialog-controller.component.html',
  styleUrls: ['./queue-ready-up-dialog-controller.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QueueReadyUpDialogControllerComponent implements OnInit, OnDestroy {

  private destroyed = new Subject<void>();
  private queueReadyUpDialogRef: BsModalRef;
  private audio = new Audio('/assets/sounds/ready_up.wav');

  constructor(
    private store: Store<AppState>,
    private modalService: BsModalService,
  ) {
    if ('Notification' in window && Notification.permission !== 'denied') {
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }
  }

  ngOnInit() {
    this.store.pipe(
      select(queueShowReadyUpDialog),
      takeUntil(this.destroyed),
    ).subscribe(show => {
      if (show) {
        this.queueReadyUpDialogRef = this.modalService.show(QueueReadyUpDialogComponent, {
          keyboard: false,
          ignoreBackdropClick: true,
        });

        this.notify();
      } else {
        if (this.queueReadyUpDialogRef) {
          this.queueReadyUpDialogRef.hide();
        }
      }
    });
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.unsubscribe();
  }

  private notify() {
    this.audio.play();
    const notification = new Notification('Ready up!', {
      body: 'A new pickup game is starting',
    });
  }

}
