import { Injectable } from '@angular/core';
import { environment } from '@environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  private readonly defaultNotificationOptions: NotificationOptions = {
    icon: `${environment.apiUrl}/assets/android-icon-192x192.png`,
  };

  constructor() {
    if ('Notification' in window && Notification.permission !== 'denied') {
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }
  }

  showNotification(title: string, options: NotificationOptions) {
    const _options = { ...options, ...this.defaultNotificationOptions };
    const notification = new Notification(title, _options);
  }
}
