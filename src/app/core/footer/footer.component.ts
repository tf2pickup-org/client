import { Component, ChangeDetectionStrategy } from '@angular/core';
import { environment } from 'src/environments/environment';
import { TokenStoreService } from '@app/auth/token-store.service';
import { AuthService } from '@app/auth/auth.service';
import { Store } from '@ngrx/store';
import { isAdmin } from '@app/profile/profile.selectors';
import { AppState } from '@app/app.state';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {

  version = environment.version;
  links = environment.footerLinks;
  isAuthenticated = this.authService.authenticated;
  isAdmin = this.store.select(isAdmin);

  constructor(
    private tokenStore: TokenStoreService,
    private authService: AuthService,
    private store: Store<AppState>,
  ) { }

  logout() {
    this.tokenStore.removeAllTokens();
    location.reload();
  }

}
