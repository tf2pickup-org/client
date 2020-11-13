import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SettingsComponent } from './settings.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { TwitchService } from '@app/twitch/twitch.service';
import { twitchTvUser } from '../profile.selectors';
import { MemoizedSelector } from '@ngrx/store';
import { AppState } from '@app/app.state';
import { By } from '@angular/platform-browser';

class TwitchServiceStub {
  login() { }
}

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;
  let store: MockStore;
  let twitchTvUserSelector: MemoizedSelector<AppState, any>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingsComponent ],
      providers: [
        provideMockStore(),
        { provide: TwitchService, useClass: TwitchServiceStub },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.inject(MockStore);
    twitchTvUserSelector = store.overrideSelector(twitchTvUser, null);

    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when the twitch profile is not linked', () => {
    it('should render the button to login via twitch', () => {
      const btn = fixture.debugElement.query(By.css('button.login-via-twitch')).nativeElement as HTMLButtonElement;
      expect(btn).toBeTruthy();

      const spy = spyOn(TestBed.inject(TwitchService), 'login');
      btn.click();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('when the user has linked twitch account', () => {
    beforeEach(() => {
      twitchTvUserSelector.setResult({ displayName: 'FAKE_DISPLAY_NAME', login: 'FAKE_LOGIN' });
      store.refreshState();
      fixture.detectChanges();
    });

    it('should render profile info', () => {
      expect(fixture.debugElement.query(By.css('.twitch-profile-info'))).toBeTruthy();
      const anchor = fixture.debugElement.query(By.css('.twitch-profile-info a')).nativeElement as HTMLAnchorElement;
      expect(anchor.href).toEqual('https://www.twitch.tv/FAKE_LOGIN/');
    });
  });
});
