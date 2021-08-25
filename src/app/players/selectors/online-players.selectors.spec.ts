import { onlinePlayersLoaded } from './online-players.selectors';

describe('onlinePlayersLoaded', () => {
  it('should return the loaded state', () => {
    expect(onlinePlayersLoaded.projector({ loaded: true })).toBe(true);
  });
});
