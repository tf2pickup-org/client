import { playerById, playerSkillByPlayerId } from './players.selectors';

describe('players selectors', () => {
  describe('playerById', () => {
    it('should find the player by id', () => {
      expect(playerById('2').projector({
        1: { id: '1', name: 'wonszu' },
        2: { id: '2', name: 'maly' },
      })).toEqual({ id: '2', name: 'maly' } as any);
    });
  });

  describe('playerSkillByPlayerId', () => {
    it('should return the given player\'s skill', () => {
      expect(playerSkillByPlayerId('2').projector({ id: '2', name: 'maly', skill: { soldier: 3 } })).toEqual({ soldier: 3 });
    });
  });
});
