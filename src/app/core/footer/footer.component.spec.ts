import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FooterComponent } from './footer.component';
import { TokenStoreService } from '@app/auth/token-store.service';
import { AuthService } from '@app/auth/auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { ChangeDetectionStrategy } from '@angular/core';
import { By } from '@angular/platform-browser';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { AppState } from '@app/app.state';
import { Store, MemoizedSelector } from '@ngrx/store';
import { isAdmin } from '@app/profile/profile.selectors';

class TokenStoreServiceStub {
  removeAllTokens() { }
}

class AuthServiceStub {
  authenticated: false;
}

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;
  let store: MockStore<AppState>;
  let isAdminSelector: MemoizedSelector<AppState, boolean>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FooterComponent ],
      imports: [
        RouterTestingModule,
      ],
      providers: [
        { provide: TokenStoreService, useClass: TokenStoreServiceStub },
        { provide: AuthService, useClass: AuthServiceStub },
        provideMockStore(),
      ]
    })
    // https://github.com/angular/angular/issues/12313
    .overrideComponent(FooterComponent, { set: { changeDetection: ChangeDetectionStrategy.Default } })
    .compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.get(Store);
    isAdminSelector = store.overrideSelector(isAdmin, false);

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render logout button only if the user is authenticated', () => {
    component.links = [];
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('a'))).toBeNull();

    component.isAuthenticated = true;
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.css('a')).nativeElement as HTMLAnchorElement;
    expect(el).toBeTruthy();
    expect(el.innerText).toBe('logout');
  });

  describe('logout()', () => {
    xit('should remove all tokens from the local storage', () => {
      // todo handle window.location.reload
      const spy = spyOn(TestBed.get(TokenStoreService), 'removeAllTokens');
      component.logout();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('admin-only links', () => {
    it('should not be rendered', () => {
      expect(fixture.debugElement.query(By.css('a[href="/player-skill-dump"]'))).toBeNull();
    });

    it('should be rendered if the current user is admin', () => {
      isAdminSelector.setResult(true);
      store.refreshState();
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('a[href="/player-skill-dump"]'))).toBeTruthy();
    });
  });
});
