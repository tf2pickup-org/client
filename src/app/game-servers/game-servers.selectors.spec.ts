import {
  gameServersLoaded,
  gameServerByName,
  gameServerById,
} from './game-servers.selectors';

describe('game servers selectors', () => {
  describe('gameServersLoaded', () => {
    it('should return the correct value', () => {
      expect(gameServersLoaded.projector({ loaded: false })).toBe(false);
      expect(gameServersLoaded.projector({ loaded: true })).toBe(true);
    });
  });

  describe('gameServerByName', () => {
    it('should find the game server', () => {
      expect(
        gameServerByName('FAKE_NAME').projector([
          { id: '1', name: 'faslkd;fjasdf' },
          { id: '2', name: 'FAKE_NAME' },
        ]),
      ).toEqual({ id: '2', name: 'FAKE_NAME' } as any);
    });
  });

  describe('gameServerById', () => {
    it('should select the game server by id', () => {
      expect(
        gameServerById('2').projector({
          1: { id: '1', name: 'fkasdfgheru' },
          2: { id: '2', name: 'FAKE_NAME' },
        }),
      ).toEqual({ id: '2', name: 'FAKE_NAME' } as any);
    });
  });
});
