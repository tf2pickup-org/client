import { Component, ChangeDetectionStrategy } from '@angular/core';
import { activeGame } from '@app/games/games.selectors';
import { Store, select } from '@ngrx/store';
import { profile } from '@app/profile/profile.selectors';
import { map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-queue-alerts',
  templateUrl: './queue-alerts.component.html',
  styleUrls: ['./queue-alerts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QueueAlertsComponent {

  activeGame = this.store.select(activeGame);
  bans = this.store.pipe(
    select(profile),
    filter(theProfile => !!theProfile),
    map(theProfile => theProfile.bans),
  );

  constructor(
    private store: Store<{}>,
  ) { }

}
