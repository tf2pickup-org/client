import { TwitchTvProfile } from '../models/twitch-tv-profile';
import { SelectTwitchTvProfilePipe } from './select-twitch-tv-profile.pipe';

describe(SelectTwitchTvProfilePipe.name, () => {
  it('create an instance', () => {
    const pipe = new SelectTwitchTvProfilePipe();
    expect(pipe).toBeTruthy();
  });

  it('should select the twitch.tv profile', () => {
    const pipe = new SelectTwitchTvProfilePipe();
    const twitchTvProfile: TwitchTvProfile = {
      provider: 'twitch.tv',
      player: 'FAKE_PLAYER_ID',
      login: 'FAKE_LOGIN',
      userId: 'FAKE_USER_ID',
    };

    expect(
      pipe.transform({
        playerId: 'FAKE_PLAYER_ID',
        linkedProfiles: [twitchTvProfile],
      }),
    ).toEqual(twitchTvProfile);
  });
});
