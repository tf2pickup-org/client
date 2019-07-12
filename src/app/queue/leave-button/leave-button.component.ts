import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AppState } from '@app/app.state';
import { Store } from '@ngrx/store';
import { leaveQueue } from '../queue.actions';

@Component({
  selector: 'app-leave-button',
  templateUrl: './leave-button.component.html',
  styleUrls: ['./leave-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeaveButtonComponent {

  constructor(
    private store: Store<AppState>,
  ) { }

  leaveQueue() {
    this.store.dispatch(leaveQueue());
  }

}
