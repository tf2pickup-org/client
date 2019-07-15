import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '@app/app.state';
import { Observable } from 'rxjs';
import { profile } from '@app/profile/profile.selectors';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-queue-container',
  templateUrl: './queue-container.component.html',
  styleUrls: ['./queue-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QueueContainerComponent {

  activeGameId: Observable<string> = this.store.pipe(
    select(profile),
    filter(p => !!p),
    map(p => p.activeGameId),
  );

  constructor(
    private store: Store<AppState>,
  ) { }

}
