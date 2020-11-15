import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestNotificationPermissionsComponent } from './request-notification-permissions/request-notification-permissions.component';

@NgModule({
  declarations: [
    RequestNotificationPermissionsComponent,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    RequestNotificationPermissionsComponent,
  ],
})
export class NotificationsModule { }
