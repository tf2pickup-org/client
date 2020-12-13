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
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { FormsModule } from '@angular/forms';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { QueueAlertsComponent } from './queue-alerts/queue-alerts.component';
import { QueueAddonsComponent } from './queue-addons/queue-addons.component';
import { PreReadyUpButtonComponent } from './pre-ready-up-button/pre-ready-up-button.component';
import { SecondsPipe } from './seconds.pipe';
import { MapVoteComponent } from './map-vote/map-vote.component';
import { MapVoteButtonComponent } from './map-vote-button/map-vote-button.component';
import { QueueNotificationsControllerComponent } from './queue-notifications-controller/queue-notifications-controller.component';
import { QueueSlotContainerComponent } from './queue-slot-container/queue-slot-container.component';
import { TwitchModule } from '@app/twitch/twitch.module';
import { NotificationsModule } from '@app/notifications/notifications.module';
import { SharedModule } from '@app/shared/shared.module';
import { IconsModule } from '@app/icons/icons.module';
import { ActiveGameSnackbarComponent } from './active-game-snackbar/active-game-snackbar.component';
import { LayoutModule } from '@angular/cdk/layout';
import { SubstituteRequestBannerComponent } from './substitute-request-banner/substitute-request-banner.component';
import { BanBannerComponent } from './ban-banner/ban-banner.component';

@NgModule({
  declarations: [
    QueueContainerComponent,
    QueueComponent,
    QueueStatusComponent,
    QueueClassSlotListComponent,
    QueueSlotItemComponent,
    QueueReadyUpDialogComponent,
    QueueAlertsComponent,
    QueueAddonsComponent,
    PreReadyUpButtonComponent,
    SecondsPipe,
    MapVoteComponent,
    MapVoteButtonComponent,
    QueueNotificationsControllerComponent,
    QueueSlotContainerComponent,
    ActiveGameSnackbarComponent,
    SubstituteRequestBannerComponent,
    BanBannerComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    StoreModule.forFeature('queue', reducer),
    EffectsModule.forFeature([QueueEffects]),
    TooltipModule,
    ButtonsModule,
    LayoutModule,

    PlayersModule,
    TwitchModule,
    NotificationsModule,
    SharedModule,
    IconsModule,

    QueueRoutingModule,
  ],
  exports: [
    QueueNotificationsControllerComponent,
  ],
})
export class QueueModule { }
