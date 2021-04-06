import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  private _permission = new ReplaySubject<NotificationPermission>(1);

  get permission() {
    return this._permission.asObservable();
  }

  constructor() {
    if ('Notification' in window) {
      this._permission.next(Notification.permission);
    }
  }

  requestPermission() {
    Notification.requestPermission().then(permission =>
      this._permission.next(permission),
    );
  }
}
