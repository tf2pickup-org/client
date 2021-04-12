import { playerById } from './players.selectors';

describe('playerById', () => {
  it('should find the player by id', () => {
    expect(
      playerById('2').projector({
        1: { id: '1', name: 'wonszu' },
        2: { id: '2', name: 'maly' },
      }),
    ).toEqual({ id: '2', name: 'maly' } as any);
  });
});
