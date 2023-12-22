import { State } from '../reducers';
import { onlinePlayersLoaded } from './online-players.selectors';

describe('onlinePlayersLoaded', () => {
  it('should return the loaded state', () => {
    expect(
      onlinePlayersLoaded.projector({ loaded: true } as State['onlinePlayers']),
    ).toBe(true);
  });
});
