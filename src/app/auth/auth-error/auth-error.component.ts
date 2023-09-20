import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject,
} from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { HTTP_PARAMS } from '../http-params';

const docsBaseUrl =
  'https://docs.tf2pickup.org/docs/player-registration-issues';

@Component({
  selector: 'app-auth-error',
  templateUrl: './auth-error.component.html',
  styleUrls: ['./auth-error.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthErrorComponent implements OnInit {
  errorMessage = 'Unknown error';
  errorLink = null;

  constructor(@Inject(HTTP_PARAMS) private readonly httpParams: HttpParams) {}

  ngOnInit() {
    if (this.httpParams.has('error')) {
      const error = this.httpParams.get('error');
      switch (error) {
        case 'no etf2l profile':
          this.errorMessage =
            'No valid ETF2L profile found for this Steam account.';
          this.errorLink = `${docsBaseUrl}/#etf2l-account-does-not-exist`;
          break;

        case 'etf2l banned':
          this.errorMessage = 'This account is banned.';
          this.errorLink = `${docsBaseUrl}/#etf2l-account-is-banned-or-blacklisted`;
          break;

        case 'not enough tf2 hours':
          this.errorMessage =
            'You do not meet the minimum required hours in TF2.';
          this.errorLink = `${docsBaseUrl}/#insufficient-tf2-in-game-hours`;
          break;

        case 'cannot verify in-game hours for TF2':
          this.errorMessage =
            'Your in-game hours for TF2 could not be verified.';
          this.errorLink = `${docsBaseUrl}/#private-steam-profile-and-game-statistics`;
          break;

        case 'etf2l name taken':
          this.errorMessage =
            'Your ETF2L name is already used by another player. You must change it to register.';
          break;

        case 'steam name taken':
          this.errorMessage =
            'Your Steam nickname is already used by another player. You must change it to register.';
          break;

        default:
          this.errorMessage = 'Unknown error';
      }
    }
  }
}
