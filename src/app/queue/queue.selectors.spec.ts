import { queueRequiredPlayerCount, queueCurrentPlayerCount, queueSlotsForClass, mySlot } from './queue.selectors';
import { QueueSlot } from './models/queue-slot';

describe('queue selectors', () => {
  describe('queueRequiredPlayerCount', () => {
    it('returns the correct amount', () => {
      expect(queueRequiredPlayerCount.projector(
        [ { soldier: 2, count: 2 } ],
        { teamCount: 2 },
      )).toBe(4);
    });
  });

  describe('queueCurrentPlayerCount', () => {
    it('returns the correct amount', () => {
      expect(queueCurrentPlayerCount.projector(
        [
          { playerId: 'FAKE_ID' },
          { },
        ],
      )).toBe(1);
    });
  });

  describe('queueSlotsForClass', () => {
    it('should return all the right slots', () => {
      expect(queueSlotsForClass('soldier').projector(
        [
          { gameClass: 'soldier' },
          { gameClass: 'scout' },
          { }
        ],
      )).toEqual([{ gameClass: 'soldier' }] as QueueSlot[]);
    });
  });

  describe('mySlot', () => {
    it('should return the right slot', () => {
      expect(mySlot.projector(
        { id: 'FAKE_ID' },
        [
          { gameClass: 'soldier', playerId: 'FAKE_ID' },
          { gameClass: 'scout', playerId: 'FAKE_ID_2' },
          { gameClass: 'scout' },
          { }
        ],
      )).toEqual({ gameClass: 'soldier', playerId: 'FAKE_ID' } as QueueSlot);
    });
  });
});
