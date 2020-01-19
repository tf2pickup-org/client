import { queueRequiredPlayerCount, queueCurrentPlayerCount, queueSlotsForClass, mySlot, mapVoteResults, mapVoteTotalCount, mapVote,
  isPreReadied, substituteRequests } from './queue.selectors';
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

  const results = [
    {
      map: 'cp_process_final',
      voteCount: 1,
    },
    {
      map: 'cp_reckoner_rc2',
      voteCount: 1,
    },
    {
      map: 'cp_snakewater_final1',
      voteCount: 0,
    }
  ];

  describe('mapVoteResults', () => {
    it('should return results', () => {
      expect(mapVoteResults.projector({
        mapVoteResults: results
      })).toEqual(results);
    });
  });

  describe('mapVoteTotalCount', () => {
    it('should calculate the correct value', () => {
      expect(mapVoteTotalCount.projector(results)).toEqual(2);
    });
  });

  describe('mapVote', () => {
    it('should return mapVote', () => {
      expect(mapVote.projector({ mapVote: 'fake_map' })).toEqual('fake_map');
    });
  });

  describe('isPreReadied', () => {
    it('should return preReady', () => {
      expect(isPreReadied.projector({ preReady: true })).toEqual(true);
      expect(isPreReadied.projector({ preReady: false })).toEqual(false);
    });
  });

  describe('substituteRequests', () => {
    const requests = [
      {
        gameId: '5e1fb93d9cacb6d6e08bc6bf',
        gameNumber: 514,
        gameClass: 'soldier',
        team: 'BLU'
      }
    ];

    it('should return substitute requests', () => {
      expect(substituteRequests.projector({ substituteRequests: requests })).toEqual(requests);
    });
  });
});
