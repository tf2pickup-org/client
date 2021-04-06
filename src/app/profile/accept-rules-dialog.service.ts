import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { AcceptRulesDialogComponent } from './accept-rules-dialog/accept-rules-dialog.component';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AcceptRulesDialogService {
  constructor(private overlay: Overlay) {}

  showAcceptRulesDialog(): Observable<void> {
    const overlay = this.overlay.create();
    const portal = new ComponentPortal(AcceptRulesDialogComponent);
    const component = overlay.attach(portal);

    return component.instance.rulesAccepted.pipe(tap(() => overlay.dispose()));
  }
}
