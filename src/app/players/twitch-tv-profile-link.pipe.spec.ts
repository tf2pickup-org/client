import { TwitchTvProfileLinkPipe } from './twitch-tv-profile-link.pipe';

describe('TwitchTvProfileLinkPipe', () => {
  let pipe: TwitchTvProfileLinkPipe;

  beforeEach(() => (pipe = new TwitchTvProfileLinkPipe()));

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should create correct twitch.tv profile link', () => {
    expect(pipe.transform('FAKE_TWITCH_LOGIN')).toEqual(
      'https://www.twitch.tv/FAKE_TWITCH_LOGIN/',
    );
  });
});
