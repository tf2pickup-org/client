import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NavigationBarComponent } from './navigation-bar.component';
import { NO_ERRORS_SCHEMA, ChangeDetectionStrategy } from '@angular/core';
import { AuthService } from '@app/auth/auth.service';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { By } from '@angular/platform-browser';
import { Store } from '@ngrx/store';

const authServiceStub = {
  authenticated: false,
};

describe('NavigationBarComponent', () => {
  let component: NavigationBarComponent;
  let fixture: ComponentFixture<NavigationBarComponent>;
  let store: MockStore<{ profile: any }>;
  const initialState = { profile: { } };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NavigationBarComponent ],
      providers: [
        { provide: AuthService, useValue: authServiceStub },
        provideMockStore({ initialState }),
      ],
      schemas: [ NO_ERRORS_SCHEMA ],
    })
    // https://github.com/angular/angular/issues/12313
    .overrideComponent(NavigationBarComponent, { set: { changeDetection: ChangeDetectionStrategy.Default } })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    store = TestBed.inject(Store) as MockStore<any>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the logo', () => {
    const el = fixture.debugElement.query(By.css('a.navbar-brand>img'));
    expect(el).toBeTruthy();
  });

  describe('when logged in', () => {
    beforeEach(() => {
      store.setState({ profile: { name: 'FAKE_NAME', id: 'FAKE_ID' } });
      component.isAuthenticated = true;
      fixture.detectChanges();
    });

    it('should render profile link', () => {
      const el = fixture.debugElement.query(By.css('.profile-link a')).nativeElement as HTMLAnchorElement;
      expect(el).toBeTruthy();
      expect(el.innerText.trim()).toBe('FAKE_NAME');
    });

    it('should render link to the settings page', () => {
      expect(fixture.debugElement.query(By.css('a[routerLink="/settings"]'))).toBeTruthy();
    });
  });

  it('app-steam-login-button should be rendered if user is not authenticated', () => {
    const el = fixture.debugElement.query(By.css('app-steam-login-button'));
    expect(el).toBeTruthy();
  });
});
