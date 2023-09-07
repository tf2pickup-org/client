import { TestBed } from '@angular/core/testing';
import { AuthErrorComponent } from './auth-error.component';
import { By } from '@angular/platform-browser';
import { HttpParams } from '@angular/common/http';
import { HTTP_PARAMS } from '../http-params';

const configureTestingModule = async (httpParams: HttpParams) => {
  await TestBed.configureTestingModule({
    declarations: [AuthErrorComponent],
    providers: [{ provide: HTTP_PARAMS, useValue: httpParams }],
  }).compileComponents();

  const fixture = TestBed.createComponent(AuthErrorComponent);
  fixture.detectChanges();
  const errorMessage = fixture.debugElement.query(
    By.css('#auth-error-message'),
  ).nativeElement;
  return { fixture, errorMessage };
};

describe('AuthErrorComponent', () => {
  const testErrors = [
    {
      key: 'no etf2l profile',
      message: 'No valid ETF2L profile found for this Steam account.',
    },
    {
      key: 'etf2l banned',
      message: 'This account is banned.',
    },
    {
      key: 'not enough tf2 hours',
      message: 'You do not meet the minimum required hours in TF2.',
    },
    {
      key: 'cannot verify in-game hours for TF2',
      message: 'Your in-game hours for TF2 could not be verified.',
    },
  ];

  let errorMessage: HTMLElement;

  for (const error of testErrors) {
    describe(`when the error='${error.key}'`, () => {
      beforeEach(async () => {
        const r = await configureTestingModule(
          new HttpParams().set('error', error.key),
        );
        errorMessage = r.errorMessage;
      });

      it('should render the error message', () => {
        expect(errorMessage.innerText).toEqual(error.message);
      });
    });
  }
});
