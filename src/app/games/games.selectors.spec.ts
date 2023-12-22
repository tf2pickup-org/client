import { gameById } from './games.selectors';
import { Game } from './models/game';

describe('gameById', () => {
  it('should select the given game by its id', () => {
    expect(
      gameById('FAKE_ID').projector({
        FAKE_ID: { id: 'FAKE_ID', number: 2 } as Game,
      }),
    ).toEqual({ id: 'FAKE_ID', number: 2 } as any);
  });
});
