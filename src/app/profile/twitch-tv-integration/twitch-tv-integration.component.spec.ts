import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Player } from '@app/players/models/player';
import { TwitchService } from '@app/twitch/twitch.service';
import { MemoizedSelector } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { EMPTY } from 'rxjs';
import { twitchTvUser } from '../profile.selectors';
import { TwitchTvIntegrationComponent } from './twitch-tv-integration.component';

describe('TwitchTvIntegrationComponent', () => {
  let component: TwitchTvIntegrationComponent;
  let fixture: ComponentFixture<TwitchTvIntegrationComponent>;
  let store: MockStore;
  let twitchTvUserSelector: MemoizedSelector<unknown, Player['twitchTvUser']>;
  let twitchService: jasmine.SpyObj<TwitchService>;

  beforeEach(() => {
    twitchService = jasmine.createSpyObj<TwitchService>(TwitchService.name, ['login', 'disconnect']);
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TwitchTvIntegrationComponent ],
      providers: [
        provideMockStore(),
        { provide: TwitchService, useValue: twitchService },
      ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    store = TestBed.inject(MockStore);
    twitchTvUserSelector = store.overrideSelector(twitchTvUser, undefined);

    fixture = TestBed.createComponent(TwitchTvIntegrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when not logged in via twitch.tv', () => {
    let loginViaTwitchTvButton: HTMLButtonElement;

    beforeEach(() => {
      loginViaTwitchTvButton = fixture.debugElement.query(By.css('.login-via-twitch-tv-button')).nativeElement as HTMLButtonElement;
    });

    it('should render the login via twitch.tv button', () => {
      expect(loginViaTwitchTvButton).toBeTruthy();
    });

    it('should login via twitch.tv', () => {
      loginViaTwitchTvButton.click();
      expect(twitchService.login).toHaveBeenCalled();
    });
  });

  describe('when logged in via twitch.tv', () => {
    beforeEach(() => {
      twitchService.disconnect.and.returnValue(EMPTY);
      twitchTvUserSelector.setResult({
        userId: 'FAKE_USER_ID',
        login: 'FAKE_USER_LOGIN',
        displayName: 'FAKE_USER',
        profileImageUrl: 'FAKE_IMAGE_URL'
      });
      store.refreshState();
      fixture.detectChanges();
    });

    it('should render link to the profile', () => {
      const anchor = fixture.debugElement.query(By.css('a')).nativeElement as HTMLAnchorElement;
      expect(anchor).toBeTruthy();
      expect(anchor.href).toMatch(/^https:\/\/www.twitch.tv\/FAKE_USER_LOGIN\/$/);
      expect(anchor.target).toBe('_blank');
    });

    it('should render the disconnect button', () => {
      const button = fixture.debugElement.query(By.css('button.disconnect-button')).nativeElement as HTMLButtonElement;
      button.click();
      expect(twitchService.disconnect).toHaveBeenCalled();
    });
  });
});
