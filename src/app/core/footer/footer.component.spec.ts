import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FooterComponent } from './footer.component';
import { TokenStoreService } from '@app/auth/token-store.service';
import { AuthService } from '@app/auth/auth.service';
import { RouterTestingModule } from '@angular/router/testing';

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

  describe('logout()', () => {
    xit('should remove all tokens from the local storage', () => {
      // todo handle window.location.reload
      const spy = spyOn(TestBed.get(TokenStoreService), 'removeAllTokens');
      component.logout();
      expect(spy).toHaveBeenCalled();
    });
  });
});
