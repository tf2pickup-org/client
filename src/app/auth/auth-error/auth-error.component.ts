import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject,
} from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { HTTP_PARAMS } from '../http-params';

const BASE_URL = 'https://docs.tf2pickup.org/player-registration-issues';

@Component({
  selector: 'app-auth-error',
  templateUrl: './auth-error.component.html',
  styleUrls: ['./auth-error.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthErrorComponent implements OnInit {
  errorMessage = 'Unknown error';
  errorLink = null;

  constructor(@Inject(HTTP_PARAMS) private httpParams: HttpParams) {}

  ngOnInit() {
    if (this.httpParams.has('error')) {
      const error = this.httpParams.get('error');
      switch (error) {
        case 'no etf2l profile':
          this.errorMessage =
            'No valid ETF2L profile found for this Steam account.';
          this.errorLink = BASE_URL + '/#etf2l-account-does-not-exist';
          break;

        case 'etf2l banned':
          this.errorMessage = 'This account is banned.';
          this.errorLink =
            BASE_URL + '/#etf2l-account-is-banned-or-blacklisted';
          break;

        case 'not enough tf2 hours':
          this.errorMessage =
            'You do not meet the minimum required hours in TF2.';
          this.errorLink = BASE_URL + '/#insufficient-tf2-in-game-hours';
          break;

        case 'cannot verify in-game hours for TF2':
          this.errorMessage =
            'Your in-game hours for TF2 could not be verified.';
          this.errorLink =
            BASE_URL + '/#private-steam-profile-and-game-statistics';
          break;
      }
    }
  }
}
