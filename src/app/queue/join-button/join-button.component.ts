import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '@app/app.state';
import { joinQueue } from '../queue.actions';

@Component({
  selector: 'app-join-button',
  templateUrl: './join-button.component.html',
  styleUrls: ['./join-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JoinButtonComponent {

  @Input()
  slot: string;

  constructor(
    private store: Store<AppState>,
  ) { }

  joinQueue() {
    this.store.dispatch(joinQueue({ slot: this.slot }));
  }

}
