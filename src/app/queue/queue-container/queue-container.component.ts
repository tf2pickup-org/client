import { Component, ChangeDetectionStrategy, OnDestroy, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '@app/app.state';
import { Subject, combineLatest } from 'rxjs';
import { queueState, mySlot } from '../queue.selectors';
import { distinctUntilChanged, takeUntil, filter, debounceTime } from 'rxjs/operators';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { leaveQueue, readyUp } from '../queue.actions';

@Component({
  selector: 'app-queue-container',
  templateUrl: './queue-container.component.html',
  styleUrls: ['./queue-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QueueContainerComponent implements OnInit, OnDestroy {

  private destroyed = new Subject<void>();
  private readyUpDialog: BsModalRef;

  @ViewChild('readyUpDialog', { static: true })
  readyUpDialogTemplate: TemplateRef<any>;

  constructor(
    private store: Store<AppState>,
    private modalService: BsModalService,
  ) { }

  ngOnInit() {
    combineLatest(
      this.store.select(queueState).pipe(distinctUntilChanged()),
      this.store.select(mySlot),
    ).pipe(
      filter(([, slot]) => !!slot),
      takeUntil(this.destroyed),
    ).subscribe(([state, slot]) => {
      console.log(state, slot);
      if (state === 'ready' && !slot.playerReady) {
        this.readyUpDialog = this.modalService.show(this.readyUpDialogTemplate, {
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

  leaveQueue() {
    this.store.dispatch(leaveQueue());
    this.readyUpDialog.hide();
  }

  confirmReady() {
    this.store.dispatch(readyUp());
    this.readyUpDialog.hide();
  }

}
