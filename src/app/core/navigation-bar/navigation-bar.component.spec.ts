import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NavigationBarComponent } from './navigation-bar.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AuthService } from '@app/auth/auth.service';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { By } from '@angular/platform-browser';
import { Store } from '@ngrx/store';

class AuthServiceStub {
  authenticated = false;
}

describe('NavigationBarComponent', () => {
  let component: NavigationBarComponent;
  let fixture: ComponentFixture<NavigationBarComponent>;
  let store: MockStore<{ profile: any }>;
  const initialState = { profile: { } };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavigationBarComponent ],
      providers: [
        { provide: AuthService, useClass: AuthServiceStub },
        provideMockStore({ initialState }),
      ],
      schemas: [ NO_ERRORS_SCHEMA ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    store = TestBed.get(Store);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the logo', () => {
    const el = fixture.debugElement.query(By.css('a.navbar-brand>img'));
    expect(el).toBeTruthy();
  });

  it('app-steam-login-button should be rendered if user is not authenticated', () => {
    const el = fixture.debugElement.query(By.css('app-steam-login-button'));
    expect(el).toBeTruthy();
  });

  it('should render profile name in a h4 tag', () => {
    store.setState({ profile: { profile: { name: 'FAKE_NAME' } } });
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.css('h4'));
    expect(el).toBeTruthy();
    expect((el.nativeElement as HTMLElement).innerText).toBe('FAKE_NAME');
  });
});
