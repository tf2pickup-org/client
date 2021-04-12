import { Component, ChangeDetectionStrategy } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Store } from '@ngrx/store';
import { isAdmin, isLoggedIn } from '@app/profile/profile.selectors';
import { AuthService } from '@app/auth/auth.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  version = environment.version;
  links = environment.footerLinks;
  isLoggedIn = this.store.select(isLoggedIn);
  isAdmin = this.store.select(isAdmin);

  constructor(private authService: AuthService, private store: Store) {}

  logout() {
    this.authService.logout();
  }
}
