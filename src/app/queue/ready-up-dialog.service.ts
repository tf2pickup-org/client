import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { Observable, race } from 'rxjs';
import { mapTo, tap } from 'rxjs/operators';
import { QueueReadyUpDialogComponent } from './queue-ready-up-dialog/queue-ready-up-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class ReadyUpDialogService {

  constructor(
    private overlay: Overlay,
  ) { }

  showReadyUpDialog(): Observable<boolean> {
    const overlay = this.overlay.create();
    const portal = new ComponentPortal(QueueReadyUpDialogComponent);
    const component = overlay.attach(portal);

    return race([
      component.instance.readyUp.pipe(mapTo(true)),
      component.instance.leaveQueue.pipe(mapTo(false)),
    ]).pipe(
      tap(() => overlay.dispose()),
    );
  }

}
