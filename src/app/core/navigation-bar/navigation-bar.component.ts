import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { AuthService } from '@app/auth/auth.service';
import { Store } from '@ngrx/store';
import { AppState } from '@app/app.state';
import { profile } from '@app/profile/profile.selectors';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationBarComponent implements OnInit {

  isAuthenticated = this.authService.authenticated;
  profile = this.store.select(profile);

  constructor(
    private authService: AuthService,
    private store: Store<AppState>,
  ) { }

  ngOnInit() {
  }

}
