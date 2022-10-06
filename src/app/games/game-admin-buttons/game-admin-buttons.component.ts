import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnDestroy,
  Output,
} from '@angular/core';
import { GameServerOption } from '@app/game-servers/models/game-server-option';
import { ConfirmDialogComponent } from '@app/shared/confirm-dialog/confirm-dialog.component';
import { race, Subject, takeUntil } from 'rxjs';
import { GameServerOptionListDialogComponent } from '../game-server-option-list-dialog/game-server-option-list-dialog.component';

@Component({
  selector: 'app-game-admin-buttons',
  templateUrl: './game-admin-buttons.component.html',
  styleUrls: ['./game-admin-buttons.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameAdminButtonsComponent implements OnDestroy {
  private destroyed = new Subject<void>();

  @Output()
  reinitializeServer = new EventEmitter<void>();

  @Output()
  forceEnd = new EventEmitter<void>();

  @Output()
  reassign = new EventEmitter<GameServerOption>();

  constructor(private overlay: Overlay) {}

  ngOnDestroy() {
    this.destroyed.next();
  }

  confirmReinitializeServer() {
    const overlay = this.overlay.create();
    const portal = new ComponentPortal(ConfirmDialogComponent);
    const component = overlay.attach(portal);

    component.instance.title = 'Reinitialize server?';
    component.instance.supportingText =
      'This will kick everyone and re-execute all the configs.';
    component.instance.accept.pipe(takeUntil(this.destroyed)).subscribe(() => {
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
    component.instance.accept.pipe(takeUntil(this.destroyed)).subscribe(() => {
      this.forceEnd.emit();
    });

    race(component.instance.accept, component.instance.cancel).subscribe(() =>
      overlay.dispose(),
    );
  }

  reassignGameServer() {
    const overlay = this.overlay.create({
      hasBackdrop: true,
      disposeOnNavigation: true,
    });
    const portal = new ComponentPortal(GameServerOptionListDialogComponent);
    const component = overlay.attach(portal);

    component.instance.optionSelect
      .pipe(takeUntil(this.destroyed))
      .subscribe(option => {
        this.reassign.emit(option);
        overlay.dispose();
      });
  }
}
