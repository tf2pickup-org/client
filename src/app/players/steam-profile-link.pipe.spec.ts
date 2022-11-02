import { SteamProfileLinkPipe } from './steam-profile-link.pipe';

describe('SteamProfileLinkPipe', () => {
  let pipe: SteamProfileLinkPipe;

  beforeEach(() => (pipe = new SteamProfileLinkPipe()));

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should create a steam link with the given profile', () => {
    expect(pipe.transform('FAKE_PROFILE')).toEqual(
      'https://steamcommunity.com/profiles/FAKE_PROFILE',
    );
  });
});
