import { Component, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from './app.state';
import { queueState, mySlot } from './queue/queue.selectors';
import { withLatestFrom, filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { BsModalService } from 'ngx-bootstrap/modal';
import { QueueReadyUpDialogComponent } from './queue/queue-ready-up-dialog/queue-ready-up-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy {

  private destroyed = new Subject<void>();

  constructor(
    private store: Store<AppState>,
    private modalService: BsModalService,
  ) { }

  ngOnInit() {
    this.store.pipe(
      select(queueState),
      withLatestFrom(this.store.select(mySlot)),
      filter(([, slot]) => !!slot),
      takeUntil(this.destroyed),
    ).subscribe(([state, slot]) => {
      if (state === 'ready' && !slot.playerReady) {
        this.modalService.show(QueueReadyUpDialogComponent, {
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
