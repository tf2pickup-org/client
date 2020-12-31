import { playerSkill } from './player-skills.selectors';

describe('playerSkill', () => {
  it('should return the given player\'s skill', () => {
    expect(playerSkill('2').projector({ 2: { skill: { soldier: 3 } } })).toEqual({ soldier: 3 });
  });
});
