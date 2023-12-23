import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TwitchStreamListComponent } from './twitch-stream-list.component';
import { MockComponent } from 'ng-mocks';
import { TwitchStreamListItemComponent } from '../twitch-stream-list-item/twitch-stream-list-item.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MemoizedSelector } from '@ngrx/store';
import { AppState } from '@app/app.state';
import { TwitchStream } from '../models/twitch-stream';
import { twitchStreams } from '../twitch.selectors';
import { By } from '@angular/platform-browser';

describe('TwitchStreamListComponent', () => {
  let component: TwitchStreamListComponent;
  let fixture: ComponentFixture<TwitchStreamListComponent>;
  let store: MockStore;
  let twitchStreamsSelector: MemoizedSelector<AppState, TwitchStream[]>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        TwitchStreamListComponent,
        MockComponent(TwitchStreamListItemComponent),
      ],
      providers: [provideMockStore()],
    }).compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.inject(MockStore);
    twitchStreamsSelector = store.overrideSelector(twitchStreams, []);

    fixture = TestBed.createComponent(TwitchStreamListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => TestBed.inject(MockStore)?.resetSelectors());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('with at least one stream', () => {
    const stream = {
      playerId: 'FAKE_PLAYER_ID',
      id: '1481304945',
      userName: 'FAKE_TWITCH_USER_NAME',
      title:
        'Virtus.pro 1-1 Team Spirit | BO3 | KVYZEE & Shadowehh | WePlay! Pushka League',
      viewerCount: 43170,
      thumbnailUrl:
        'https://static-cdn.jtvnw.net/previews-ttv/live_user_weplayesport_ru-{width}x{height}.jpg',
    };

    beforeEach(() => {
      twitchStreamsSelector.setResult([stream]);
      store.refreshState();
      fixture.detectChanges();
    });

    it('should render TwitchStreamListItemComponent', () => {
      const twitchStreamListItemComponents = fixture.debugElement
        .queryAll(By.css('app-twitch-stream-list-item'))
        .map(e => e.componentInstance as TwitchStreamListItemComponent);
      expect(twitchStreamListItemComponents.length).toEqual(1);
      expect(twitchStreamListItemComponents[0].stream).toEqual(stream);
    });
  });
});
