import { Component, OnInit, ChangeDetectionStrategy, Inject } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { HTTP_PARAMS } from '../http-params';

@Component({
  selector: 'app-auth-error',
  templateUrl: './auth-error.component.html',
  styleUrls: ['./auth-error.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthErrorComponent implements OnInit {

  errorMessage = 'Unknown error';

  constructor(
    @Inject(HTTP_PARAMS) private httpParams: HttpParams,
  ) { }

  ngOnInit() {
    if (this.httpParams.has('error')) {
      const error = this.httpParams.get('error');
      switch (error) {
        case 'no etf2l profile':
          this.errorMessage = 'No valid ETF2L profile found for this Steam account.';
          break;

        case 'not enough steam hours':
          this.errorMessage = 'You do not meet the required amount of hours in Team Fortress 2.';
          break;

        case 'etf2l banned':
          this.errorMessage = 'This account is banned.';
          break;

        case 'not enough tf2 hours':
          this.errorMessage = 'You do not meet the minimum required hours in TF2.';
          break;

        case 'cannot verify in-game hours for TF2':
          this.errorMessage = 'Your in-game hours for TF2 could not be verified.';
          break;
      }
    }
  }

}
