import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FooterComponent } from './footer.component';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { AppState } from '@app/app.state';
import { MemoizedSelector } from '@ngrx/store';
import { isAdmin, isLoggedIn } from '@app/profile/profile.selectors';
import { AuthService } from '@app/auth/auth.service';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;
  let store: MockStore<AppState>;
  let authService: jasmine.SpyObj<AuthService>;
  let isAdminSelector: MemoizedSelector<AppState, boolean>;
  let isLoggedInSelector: MemoizedSelector<AppState, boolean>;

  beforeEach(() => {
    authService = jasmine.createSpyObj<AuthService>(AuthService.name, [
      'logout',
    ]);
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FooterComponent],
      imports: [RouterTestingModule],
      providers: [
        { provide: AuthService, useValue: authService },
        provideMockStore(),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.inject(MockStore);
    isAdminSelector = store.overrideSelector(isAdmin, false);
    isLoggedInSelector = store.overrideSelector(isLoggedIn, false);

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when the user is not logged in', () => {
    it('should not render the logout button', () => {
      expect(fixture.debugElement.query(By.css('a[logoutButton]'))).toBeFalsy();
    });
  });

  describe('when the user is logged in', () => {
    let logoutButton: HTMLElement;

    beforeEach(() => {
      isLoggedInSelector.setResult(true);
      store.refreshState();
      fixture.detectChanges();

      logoutButton = fixture.debugElement.query(
        By.css('a[logoutButton]'),
      ).nativeElement;
    });

    it('should render the logout button', () => {
      expect(logoutButton).toBeTruthy();
    });

    describe('when the user clicks the logout button', () => {
      beforeEach(() => {
        logoutButton.click();
      });

      it('should logout', () => {
        expect(authService.logout).toHaveBeenCalled();
      });
    });
  });

  describe('when the user is logged in as an admin', () => {
    beforeEach(() => {
      isLoggedInSelector.setResult(true);
      isAdminSelector.setResult(true);
      store.refreshState();
      fixture.detectChanges();
    });

    it('should render admin panel link', () => {
      expect(
        fixture.debugElement.query(By.css('a[href="/admin"]')),
      ).toBeTruthy();
    });
  });
});
