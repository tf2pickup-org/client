import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AuthService } from '@app/auth/auth.service';
import { Store } from '@ngrx/store';
import { profile } from '@app/profile/profile.selectors';
import { environment } from '@environment';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationBarComponent {

  isAuthenticated = this.authService.authenticated;
  profile = this.store.select(profile);
  links = environment.headerLinks;

  constructor(
    private authService: AuthService,
    private store: Store,
  ) { }

}
