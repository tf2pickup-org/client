import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NotificationsService } from '../notifications.service';

@Component({
  selector: 'app-request-notification-permissions',
  templateUrl: './request-notification-permissions.component.html',
  styleUrls: ['./request-notification-permissions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestNotificationPermissionsComponent {

  permission = this.notificationsService.permission;

  constructor(
    private notificationsService: NotificationsService,
  ) { }

  requestPermission() {
    this.notificationsService.requestPermission();
  }

}
