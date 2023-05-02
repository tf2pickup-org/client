import { animate, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NotificationsService } from '../notifications.service';

@Component({
  selector: 'app-request-notification-permissions',
  templateUrl: './request-notification-permissions.component.html',
  styleUrls: ['./request-notification-permissions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('fadeOut', [
      transition(':leave', [
        animate(
          '400ms ease-in-out',
          style({
            opacity: 0,
            height: 0,
            paddingTop: 0,
            paddingBottom: 0,
            marginTop: 0,
            marginBottom: 0,
          }),
        ),
      ]),
    ]),
  ],
})
export class RequestNotificationPermissionsComponent {
  permission = this.notificationsService.permission;

  constructor(private readonly notificationsService: NotificationsService) {}

  async requestPermission() {
    await this.notificationsService.requestPermission();
  }
}
