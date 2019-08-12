import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { reducer } from './queue.reducer';
import { QueueContainerComponent } from './queue-container/queue-container.component';
import { QueueRoutingModule } from './queue-routing.module';
import { QueueComponent } from './queue/queue.component';
import { QueueStatusComponent } from './queue-status/queue-status.component';
import { EffectsModule } from '@ngrx/effects';
import { QueueEffects } from './queue.effects';
import { HttpClientModule } from '@angular/common/http';
import { QueueClassSlotListComponent } from './queue-class-slot-list/queue-class-slot-list.component';
import { QueueSlotItemComponent } from './queue-slot-item/queue-slot-item.component';
import { PlayersModule } from '@app/players/players.module';
import { QueueReadyUpDialogComponent } from './queue-ready-up-dialog/queue-ready-up-dialog.component';
import { QueueReadyUpDialogControllerComponent } from './queue-ready-up-dialog-controller/queue-ready-up-dialog-controller.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { FormsModule } from '@angular/forms';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { QueueAlertsComponent } from './queue-alerts/queue-alerts.component';

@NgModule({
  declarations: [
    QueueContainerComponent,
    QueueComponent,
    QueueStatusComponent,
    QueueClassSlotListComponent,
    QueueSlotItemComponent,
    QueueReadyUpDialogComponent,
    QueueReadyUpDialogControllerComponent,
    QueueAlertsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    StoreModule.forFeature('queue', reducer),
    EffectsModule.forFeature([QueueEffects]),
    TooltipModule,
    ButtonsModule,

    PlayersModule,

    QueueRoutingModule,
  ],
  exports: [
    QueueReadyUpDialogControllerComponent,
  ],
  entryComponents: [
    QueueReadyUpDialogComponent,
  ],
})
export class QueueModule { }
