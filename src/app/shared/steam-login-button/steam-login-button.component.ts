import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { API_URL } from '@app/api-url';

@Component({
  selector: 'app-steam-login-button',
  templateUrl: './steam-login-button.component.html',
  styleUrls: ['./steam-login-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SteamLoginButtonComponent {

  constructor(
    @Inject(API_URL) public apiUrl: string,
  ) { }

}
