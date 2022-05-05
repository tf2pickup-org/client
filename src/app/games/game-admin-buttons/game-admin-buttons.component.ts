import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { ConfirmDialogComponent } from '@app/shared/confirm-dialog/confirm-dialog.component';
import { race } from 'rxjs';

@Component({
  selector: 'app-game-admin-buttons',
  templateUrl: './game-admin-buttons.component.html',
  styleUrls: ['./game-admin-buttons.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameAdminButtonsComponent {
  @Output()
  reinitializeServer = new EventEmitter<void>();

  @Output()
  forceEnd = new EventEmitter<void>();

  constructor(private overlay: Overlay) {}

  confirmReinitializeServer() {
    const overlay = this.overlay.create();
    const portal = new ComponentPortal(ConfirmDialogComponent);
    const component = overlay.attach(portal);

    component.instance.title = 'Reinitialize server?';
    component.instance.supportingText =
      'This will kick everyone and re-execute all the configs.';
    component.instance.accept.subscribe(() => {
      this.reinitializeServer.emit();
    });

    race(component.instance.accept, component.instance.cancel).subscribe(() =>
      overlay.dispose(),
    );
  }

  confirmForceEnd() {
    const overlay = this.overlay.create();
    const portal = new ComponentPortal(ConfirmDialogComponent);
    const component = overlay.attach(portal);

    component.instance.title = 'Force end the game?';
    component.instance.accept.subscribe(() => {
      this.forceEnd.emit();
    });

    race(component.instance.accept, component.instance.cancel).subscribe(() =>
      overlay.dispose(),
    );
  }
}
