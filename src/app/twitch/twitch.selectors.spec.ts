import { twitchStreams } from './twitch.selectors';

describe('twitchStreams', () => {
  it('returns streams', () => {
    expect(twitchStreams.projector({ streams: [] })).toEqual([]);
  });
});
