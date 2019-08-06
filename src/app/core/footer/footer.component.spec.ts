import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FooterComponent } from './footer.component';
import { TokenStoreService } from '@app/auth/token-store.service';
import { AuthService } from '@app/auth/auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { ChangeDetectionStrategy } from '@angular/core';
import { By } from '@angular/platform-browser';

class TokenStoreServiceStub {
  removeAllTokens() { }
}

class AuthServiceStub {
  authenticated: false;
}

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FooterComponent ],
      imports: [
        RouterTestingModule,
      ],
      providers: [
        { provide: TokenStoreService, useClass: TokenStoreServiceStub },
        { provide: AuthService, useClass: AuthServiceStub },
      ]
    })
    // https://github.com/angular/angular/issues/12313
    .overrideComponent(FooterComponent, { set: { changeDetection: ChangeDetectionStrategy.Default } })
    .compileComponents();
  }));

  beforeEach(() => {
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
});
