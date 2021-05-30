import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TwitchStreamListItemComponent } from './twitch-stream-list-item.component';
import { By } from '@angular/platform-browser';
import { ChangeDetectionStrategy } from '@angular/core';
import { MockComponent } from 'ng-mocks';
import { PlayerNameComponent } from '@app/players/player-name/player-name.component';

describe('TwitchStreamListItemComponent', () => {
  let component: TwitchStreamListItemComponent;
  let fixture: ComponentFixture<TwitchStreamListItemComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          TwitchStreamListItemComponent,
          MockComponent(PlayerNameComponent),
        ],
      })
        // https://github.com/angular/angular/issues/12313
        .overrideComponent(TwitchStreamListItemComponent, {
          set: { changeDetection: ChangeDetectionStrategy.Default },
        })
        .compileComponents();
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TwitchStreamListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('with a valid twitch stream', () => {
    beforeEach(() => {
      component.stream = {
        playerId: 'FAKE_PLAYER_ID',
        id: '1481304945',
        userName: 'FAKE_TWITCH_USER_NAME',
        title:
          'Virtus.pro 1-1 Team Spirit | BO3 | KVYZEE & Shadowehh | WePlay! Pushka League',
        viewerCount: 43170,
        thumbnailUrl:
          'https://static-cdn.jtvnw.net/previews-ttv/live_user_weplayesport_ru-{width}x{height}.jpg',
      };
      fixture.detectChanges();
    });

    it("should link to the user's channel", () => {
      const anchor = fixture.debugElement.query(By.css('a'))
        .nativeElement as HTMLAnchorElement;
      expect(anchor.href).toEqual(
        'https://www.twitch.tv/FAKE_TWITCH_USER_NAME',
      );
    });

    it('should replace thumbnail height and width', () => {
      const img = fixture.debugElement.query(By.css('.stream-thumbnail'))
        .nativeElement as HTMLImageElement;
      expect(img.src).toEqual(
        'https://static-cdn.jtvnw.net/previews-ttv/live_user_weplayesport_ru-100x50.jpg',
      );
    });

    it('should render player name', () => {
      const playerNameComponent = fixture.debugElement.query(
        By.css('app-player-name'),
      ).componentInstance as PlayerNameComponent;
      expect(playerNameComponent.playerId).toEqual('FAKE_PLAYER_ID');
    });
  });

  describe('when the twitch stream is not bound to a player', () => {
    beforeEach(() => {
      component.stream = {
        id: '42220566028',
        userName: 'KritzKast',
        title:
          'ETF2L Highlander S24 Premiership W2: Feila eSports vs. inVision',
        viewerCount: 155,
        thumbnailUrl:
          'https://static-cdn.jtvnw.net/previews-ttv/live_user_kritzkast-{width}x{height}.jpg',
      };
      fixture.detectChanges();
    });

    it('should render the stream username', () => {
      expect(fixture.debugElement.query(By.css('app-player-name'))).toBe(null);
      const content = fixture.debugElement.query(By.css('.content'))
        .nativeElement as HTMLDivElement;
      expect(content.innerText).toMatch(/^KritzKast/);
    });
  });
});
