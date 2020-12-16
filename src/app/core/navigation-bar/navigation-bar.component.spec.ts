import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NavigationBarComponent } from './navigation-bar.component';
import { ChangeDetectionStrategy } from '@angular/core';
import { AuthService } from '@app/auth/auth.service';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

const authServiceStub = {
  authenticated: false,
};

describe('NavigationBarComponent', () => {
  let component: NavigationBarComponent;
  let fixture: ComponentFixture<NavigationBarComponent>;
  let store: MockStore;
  const initialState = { profile: { } };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NavigationBarComponent ],
      providers: [
        { provide: AuthService, useValue: authServiceStub },
        provideMockStore({ initialState }),
      ],
      imports: [
        RouterTestingModule,
      ],
    })
    // https://github.com/angular/angular/issues/12313
    .overrideComponent(NavigationBarComponent, { set: { changeDetection: ChangeDetectionStrategy.Default } })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    store = TestBed.inject(MockStore);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the logo', () => {
    const el = fixture.debugElement.query(By.css('.navbar__logo>img'));
    expect(el).toBeTruthy();
  });

  describe('when logged in', () => {
    beforeEach(() => {
      store.setState({
        profile: {
          name: 'FAKE_NAME',
          id: 'FAKE_ID',
          avatar: {
            small: 'FAKE_SMALL_AVATAR_URL',
            medium: 'FAKE_MEDIUM_AVATAR_URL',
            large: 'FAKE_LARGE_AVATAR_URL',
          },
        },
      });
      component.isAuthenticated = true;
      fixture.detectChanges();
    });

    it('should render profile link', () => {
      const el = fixture.debugElement.query(By.css('a.navbar__link--profile')).nativeElement as HTMLAnchorElement;
      expect(el).toBeTruthy();
      expect(el.innerText.trim()).toBe('FAKE_NAME');
      expect(el.href).toMatch(/\/player\/FAKE_ID$/);
    });

    it('should render link to the settings page', () => {
      const el = fixture.debugElement.query(By.css('a.navbar__link--settings')).nativeElement as HTMLAnchorElement;
      expect(el).toBeTruthy();
      expect(el.href).toMatch(/\/settings/);
    });
  });

  it('app-steam-login-button should be rendered if user is not authenticated', () => {
    const el = fixture.debugElement.query(By.css('app-steam-login-button'));
    expect(el).toBeTruthy();
  });
});
