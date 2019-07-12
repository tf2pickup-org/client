import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from './app.state';
import { AuthService } from './auth/auth.service';
import { profile } from './profile/profile.selectors';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {

  isAuthenticated = this.authService.authenticated;
  profile = this.store.select(profile);

  constructor(
    private authService: AuthService,
    private store: Store<AppState>,
  ) { }

}
