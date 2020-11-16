import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestNotificationPermissionsComponent } from './request-notification-permissions/request-notification-permissions.component';
import { IconsModule } from '@app/icons/icons.module';

@NgModule({
  declarations: [
    RequestNotificationPermissionsComponent,
  ],
  imports: [
    CommonModule,
    IconsModule,
  ],
  exports: [
    RequestNotificationPermissionsComponent,
  ],
})
export class NotificationsModule { }
