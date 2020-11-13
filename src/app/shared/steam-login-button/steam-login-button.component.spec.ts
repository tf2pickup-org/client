import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SteamLoginButtonComponent } from './steam-login-button.component';
import { API_URL } from '@app/api-url';
import { By } from '@angular/platform-browser';

describe('SteamLoginButtonComponent', () => {
  let component: SteamLoginButtonComponent;
  let fixture: ComponentFixture<SteamLoginButtonComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SteamLoginButtonComponent ],
      providers: [
        { provide: API_URL, useValue: 'http://fake.host' },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SteamLoginButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should redirect to the right location', () => {
    const anchor = fixture.debugElement.query(By.css('a')).nativeElement as HTMLAnchorElement;
    expect(anchor.href).toEqual('http://fake.host/auth/steam');
  });
});
