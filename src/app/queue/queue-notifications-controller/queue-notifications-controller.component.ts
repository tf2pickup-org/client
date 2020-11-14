import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { NotificationsService } from '@app/notifications/notifications.service';
import { SoundPlayerService, Sound } from '@app/notifications/sound-player.service';
import { substituteRequests } from '../queue.selectors';
import { withLatestFrom, debounceTime, filter } from 'rxjs/operators';
import { isPlayingGame } from '@app/games/games.selectors';

@Component({
  selector: 'app-queue-notifications-controller',
  templateUrl: './queue-notifications-controller.component.html',
  styleUrls: ['./queue-notifications-controller.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QueueNotificationsControllerComponent implements OnInit {

  constructor(
    private store: Store,
    private notificationsService: NotificationsService,
    private soundPlayerService: SoundPlayerService,
  ) { }

  ngOnInit() {
    this.store.pipe(
      select(substituteRequests),
      filter(requests => requests?.length > 0),
      withLatestFrom(this.store.select(isPlayingGame)),
      debounceTime(1000),
    ).subscribe(([, playingGame]) => {
      if (!playingGame) {
        this.soundPlayerService.playSound(Sound.cmonToughGuy);
        this.notificationsService.showNotification('A subsitute is needed!', { });
      }
    });
  }

}
