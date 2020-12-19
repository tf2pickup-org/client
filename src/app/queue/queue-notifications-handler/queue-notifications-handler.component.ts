import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { isPlayingGame } from '@app/games/games.selectors';
import { awaitsReadyUp } from '@app/selectors';
import { select, Store } from '@ngrx/store';
import { Howl } from 'howler';
import { NEVER } from 'rxjs';
import { debounceTime, switchMap, map, filter, withLatestFrom } from 'rxjs/operators';
import { QueueReadyUpAction } from '../queue-ready-up-dialog/queue-ready-up-dialog.component';
import { readyUp, leaveQueue } from '../queue.actions';
import { substituteRequests } from '../queue.selectors';
import { ReadyUpService } from '../ready-up.service';

@Component({
  selector: 'app-queue-notifications-handler',
  templateUrl: './queue-notifications-handler.component.html',
  styleUrls: ['./queue-notifications-handler.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QueueNotificationsHandlerComponent implements OnInit {

  constructor(
    private store: Store,
    private readyUpService: ReadyUpService,
  ) { }

  ngOnInit() {
    this.store.pipe(
      select(awaitsReadyUp),
      debounceTime(100),
      switchMap(shown => shown ? this.readyUpService.askUserToReadyUp() : NEVER),
      map(action => {
        switch (action) {
          case QueueReadyUpAction.readyUp:
            return readyUp();
          case QueueReadyUpAction.leaveQueue:
            return leaveQueue();
        }
      }),
    ).subscribe(action => this.store.dispatch(action));

    this.store.pipe(
      select(substituteRequests),
      filter(requests => requests?.length > 0),
      withLatestFrom(this.store.select(isPlayingGame)),
      debounceTime(1000),
    ).subscribe(([requests, playingGame]) => {
      if (!playingGame) {
        new Howl({
          src: [ '/assets/sounds/cmon_tough_guy.wav' ],
          autoplay: true,
        });

        requests.forEach(request => {
          new Notification('A subsitute is needed!', {
            body: `Team ${request.team} needs a substitute for ${request.gameClass} in game #${request.gameNumber}`,
            icon: '/assets/android-icon-48x48.png',
          });
        });
      }
    });
  }

}
