import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
} from '@angular/core';
import { isPlayingGame } from '@app/profile/profile.selectors';
import { awaitsReadyUp } from '@app/selectors';
import { SoundPlayerService } from '@app/shared/sound-player.service';
import { Store } from '@ngrx/store';
import { NEVER, of, Subject } from 'rxjs';
import {
  debounceTime,
  switchMap,
  map,
  filter,
  withLatestFrom,
  takeUntil,
} from 'rxjs/operators';
import { QueueReadyUpAction } from '../queue-ready-up-dialog/queue-ready-up-dialog.component';
import { readyUp, leaveQueue } from '../queue.actions';
import { isPreReadied, substituteRequests } from '../queue.selectors';
import { ReadyUpService } from '../ready-up.service';

@Component({
  selector: 'app-queue-notifications-handler',
  templateUrl: './queue-notifications-handler.component.html',
  styleUrls: ['./queue-notifications-handler.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QueueNotificationsHandlerComponent implements OnInit, OnDestroy {
  private destroyed = new Subject<void>();

  constructor(
    private store: Store,
    private readyUpService: ReadyUpService,
    private soundPlayerService: SoundPlayerService,
  ) {}

  ngOnInit() {
    this.store
      .select(awaitsReadyUp)
      .pipe(
        takeUntil(this.destroyed),
        debounceTime(100),
        withLatestFrom(this.store.select(isPreReadied)),
        // eslint-disable-next-line no-shadow
        switchMap(([awaitsReadyUp, isPreReadied]) => {
          if (awaitsReadyUp) {
            if (isPreReadied) {
              return of(readyUp());
            } else {
              return this.readyUpService.askUserToReadyUp().pipe(
                map(action => {
                  switch (action) {
                    case QueueReadyUpAction.readyUp:
                      return readyUp();
                    case QueueReadyUpAction.leaveQueue:
                      return leaveQueue();
                  }
                }),
              );
            }
          }
          return NEVER;
        }),
      )
      .subscribe(action => this.store.dispatch(action));

    this.store
      .select(substituteRequests)
      .pipe(
        takeUntil(this.destroyed),
        filter(requests => Boolean(requests)),
        filter(requests => requests!.length > 0),
        withLatestFrom(this.store.select(isPlayingGame)),
        debounceTime(1000),
      )
      .subscribe(([requests, playingGame]) => {
        if (!playingGame) {
          this.soundPlayerService
            .playSound(
              ['webm', 'wav'].map(
                format => `/assets/sounds/cmon_tough_guy.${format}`,
              ),
            )
            .subscribe();

          requests!.forEach(request => {
            new Notification('A subsitute is needed!', {
              body: `Team ${request.team} needs a substitute for ${request.gameClass} in game #${request.gameNumber}`,
              icon: '/assets/android-icon-48x48.png',
            });
          });
        }
      });
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.unsubscribe();
  }
}
