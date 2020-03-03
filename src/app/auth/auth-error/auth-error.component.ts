import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-auth-error',
  templateUrl: './auth-error.component.html',
  styleUrls: ['./auth-error.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthErrorComponent implements OnInit {

  errorMessage = 'Unknown error';

  ngOnInit() {
    const params = new HttpParams({
      fromString: window.location.search.substr(1)
    });

    if (params.has('error')) {
      const error = params.get('error');
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
      }
    }
  }

}
