import { Component, Input, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { QueueSlot } from '../models/queue-slot';
import { Store, select } from '@ngrx/store';
import { AppState } from '@app/app.state';
import { queueSlotsForClass } from '../queue.selectors';
import { profile } from '@app/profile/profile.selectors';
import { map, takeUntil } from 'rxjs/operators';
import { AuthService } from '@app/auth/auth.service';

@Component({
  selector: 'app-queue-class-slot-list',
  templateUrl: './queue-class-slot-list.component.html',
  styleUrls: ['./queue-class-slot-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QueueClassSlotListComponent implements OnInit, OnDestroy {

  private destroyed = new Subject<void>();
  currentPlayerId: string;
  slots: Observable<QueueSlot[]>;
  disabled = !this.authService.authenticated;

  @Input()
  set gameClass(gameClass: string) {
    this.slots = this.store.select(queueSlotsForClass(gameClass));
  }

  constructor(
    private store: Store<AppState>,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.store.pipe(
      select(profile),
      takeUntil(this.destroyed),
    ).subscribe(theProfile => {
      if (theProfile) {
        this.currentPlayerId = theProfile.id;
        this.disabled = !!theProfile.activeGameId;
      }
    });
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.unsubscribe();
  }

}
