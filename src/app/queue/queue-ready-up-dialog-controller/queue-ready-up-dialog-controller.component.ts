import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Store, select } from '@ngrx/store';
import { AppState } from '@app/app.state';
import { queueState, mySlot } from '../queue.selectors';
import { withLatestFrom, takeUntil } from 'rxjs/operators';
import { QueueReadyUpDialogComponent } from '../queue-ready-up-dialog/queue-ready-up-dialog.component';

@Component({
  selector: 'app-queue-ready-up-dialog-controller',
  templateUrl: './queue-ready-up-dialog-controller.component.html',
  styleUrls: ['./queue-ready-up-dialog-controller.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QueueReadyUpDialogControllerComponent implements OnInit, OnDestroy {

  private destroyed = new Subject<void>();
  private queueReadyUpDialogRef: BsModalRef;

  constructor(
    private store: Store<AppState>,
    private modalService: BsModalService,
  ) { }

  ngOnInit() {
    this.store.pipe(
      select(queueState),
      withLatestFrom(this.store.select(mySlot)),
      takeUntil(this.destroyed),
    ).subscribe(([state, slot]) => {
      if (this.queueReadyUpDialogRef && !slot) {
        this.queueReadyUpDialogRef.hide();
        return;
      }

      if (state === 'ready' && !slot.playerReady) {
        this.queueReadyUpDialogRef = this.modalService.show(QueueReadyUpDialogComponent, {
          keyboard: false,
          ignoreBackdropClick: true,
        });
      }
    });
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.unsubscribe();
  }

}
