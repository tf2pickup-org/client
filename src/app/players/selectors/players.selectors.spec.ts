import { Player } from '../models/player';
import { playerById } from './players.selectors';

describe('playerById', () => {
  it('should find the player by id', () => {
    expect(
      playerById('2').projector({
        1: { id: '1', name: 'wonszu' } as Player,
        2: { id: '2', name: 'maly' } as Player,
      }),
    ).toEqual({ id: '2', name: 'maly' } as Player);
  });
});
