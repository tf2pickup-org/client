import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { ioConnected } from '@app/io/io.selectors';
import { delay, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-offline-state-banner',
  templateUrl: './offline-state-banner.component.html',
  styleUrls: ['./offline-state-banner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfflineStateBannerComponent {
  ioConnected = this.store.select(ioConnected).pipe(
    switchMap(connected => {
      if (connected) {
        return of(connected);
      } else {
        return of(connected).pipe(delay(1000));
      }
    }),
  );

  constructor(private store: Store) {}
}
