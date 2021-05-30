import { linkedProfilesByPlayerId } from './linked-profiles.selectors';

describe('linkedProfilesByPlayerId', () => {
  it('should select the linked profiles for the given player id', () => {
    const linkedProfiles = {
      playerId: 'FAKE_PLAYER_ID',
      linkedProfiles: [],
    };

    expect(
      linkedProfilesByPlayerId('FAKE_PLAYER_ID').projector({
        FAKE_PLAYER_ID: linkedProfiles,
      }),
    ).toEqual(linkedProfiles);
  });
});
