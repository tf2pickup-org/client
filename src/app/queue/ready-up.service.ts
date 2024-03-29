import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  QueueReadyUpAction,
  QueueReadyUpDialogComponent,
} from './queue-ready-up-dialog/queue-ready-up-dialog.component';
import { SoundPlayerService } from '@app/shared/sound-player.service';

@Injectable({
  providedIn: 'root',
})
export class ReadyUpService {
  constructor(
    private overlay: Overlay,
    private soundPlayerService: SoundPlayerService,
  ) {}

  /**
   * Ask the user to ready up; show notification, play the sound and open the ready up dialog.
   */
  askUserToReadyUp(): Observable<QueueReadyUpAction> {
    return new Observable(subscriber => {
      const overlay = this.overlay.create();
      const portal = new ComponentPortal(QueueReadyUpDialogComponent);
      const component = overlay.attach(portal);
      const player = this.soundPlayerService
        .playSound(
          ['webm', 'wav'].map(format => `/assets/sounds/ready_up.${format}`),
        )
        .subscribe();

      const notification = new Notification('Ready up!', {
        body: 'A new pickup game is starting',
        icon: '/assets/android-icon-48x48.png',
      });

      const subscription = component.instance.action.subscribe(
        (action: QueueReadyUpAction) => {
          subscriber.next(action);
          subscriber.complete();
        },
      );

      return () => {
        subscription.unsubscribe();
        overlay.dispose();
        player.unsubscribe();
        notification.close();
      };
    });
  }
}
