import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { QueueReadyUpAction, QueueReadyUpDialogComponent } from './queue-ready-up-dialog/queue-ready-up-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class ReadyUpDialogService {

  constructor(
    private overlay: Overlay,
  ) { }

  showReadyUpDialog(): Observable<QueueReadyUpAction> {
    const overlay = this.overlay.create();
    const portal = new ComponentPortal(QueueReadyUpDialogComponent);
    const component = overlay.attach(portal);

    return new Observable(subscriber => {
      component.instance.action.subscribe((action: QueueReadyUpAction) => {
        subscriber.next(action);
        subscriber.complete();
      });
      return () => overlay.dispose();
    });
  }

}
