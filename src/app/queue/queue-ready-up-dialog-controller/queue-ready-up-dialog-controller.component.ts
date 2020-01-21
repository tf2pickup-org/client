import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Store, select } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import { QueueReadyUpDialogComponent } from '../queue-ready-up-dialog/queue-ready-up-dialog.component';
import { queueShowReadyUpDialog } from '../queue.selectors';
import { NotificationsService } from '@app/notifications/notifications.service';
import { SoundPlayerService, Sound } from '@app/notifications/sound-player.service';

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
    private store: Store<{}>,
    private modalService: BsModalService,
    private notificationsService: NotificationsService,
    private soundPlayerService: SoundPlayerService,
  ) { }

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
    this.notificationsService.showNotification('Ready up!', {
      body: 'A new pickup game is starting',
    });
    this.soundPlayerService.playSound(Sound.ReadyUp);
  }

}
