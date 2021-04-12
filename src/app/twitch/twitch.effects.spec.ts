import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { of, ReplaySubject } from 'rxjs';
import { TwitchEffects } from './twitch.effects';
import { loadTwitchStreams, twitchStreamsLoaded } from './twitch.actions';
import { TwitchService } from './twitch.service';
import { Action } from '@ngrx/store';

const mockStreams = [
  {
    playerId: 'FAKE_PLAYER_ID',
    id: '1481304945',
    userName: 'FAKE_TWITCH_USER_NAME',
    title:
      'Virtus.pro 1-1 Team Spirit | BO3 | KVYZEE & Shadowehh | WePlay! Pushka League',
    viewerCount: 43170,
    thumbnailUrl:
      'https://static-cdn.jtvnw.net/previews-ttv/live_user_weplayesport_ru-{width}x{height}.jpg',
  },
];

class TwitchServiceStub {
  fetchStreams() {
    return of(mockStreams);
  }
}

describe('TwitchEffects', () => {
  let actions: ReplaySubject<Action>;
  let effects: TwitchEffects;

  beforeEach(() => (actions = new ReplaySubject<Action>(1)));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TwitchEffects,
        provideMockActions(() => actions),
        { provide: TwitchService, useClass: TwitchServiceStub },
      ],
    });

    effects = TestBed.inject(TwitchEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  it('should initially load twitch streams', () => {
    expect(effects.ngrxOnInitEffects()).toEqual(loadTwitchStreams());
  });

  describe('#loadTwitchStreams()', () => {
    it('should attempt to load twitch streams', () => {
      effects.loadTwitchStreams.subscribe(action =>
        expect(action).toEqual(
          twitchStreamsLoaded({ twitchStreams: mockStreams }),
        ),
      );
      actions.next(loadTwitchStreams());
    });
  });
});
