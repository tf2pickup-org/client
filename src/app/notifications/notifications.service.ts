import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  private readonly _permission = new ReplaySubject<NotificationPermission>(1);

  get permission() {
    return this._permission.asObservable();
  }

  constructor() {
    if ('Notification' in window) {
      this._permission.next(Notification.permission);
    }
  }

  async requestPermission() {
    try {
      const permission = await Notification.requestPermission();
      this._permission.next(permission);
    } catch (error) {
      console.error(error);
    }
  }
}
