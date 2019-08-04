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
          this.errorMessage = 'You do not have an ETF2L profile.';
          break;

        case 'not enough steam hours':
          this.errorMessage = 'You do not meet the required amount of hours in Team Fortress 2.';
          break;

        case 'etf2l banned':
          this.errorMessage = 'This account is banned.';
          break;
      }
    }
  }

}
