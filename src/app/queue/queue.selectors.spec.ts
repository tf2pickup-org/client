import {
  queueRequiredPlayerCount,
  queueCurrentPlayerCount,
  queueSlotsForClass,
  mySlot,
  mapVoteResults,
  mapVoteTotalCount,
  mapVote,
  isPreReadied,
  substituteRequests,
  slotById,
  queueFriendships,
} from './queue.selectors';
import { QueueSlot } from './models/queue-slot';
import { Player } from '@app/players/models/player';
import { State } from './queue.reducer';
import { Tf2ClassName } from '@app/shared/models/tf2-class-name';
import { QueueConfig } from './models/queue-config';

describe('queue selectors', () => {
  describe('queueRequiredPlayerCount', () => {
    it('returns the correct amount', () => {
      expect(
        queueRequiredPlayerCount.projector(
          [{ name: Tf2ClassName.soldier, count: 2 }],
          {
            teamCount: 2,
          } as QueueConfig,
        ),
      ).toBe(4);
    });
  });

  describe('queueCurrentPlayerCount', () => {
    it('returns the correct amount', () => {
      expect(
        queueCurrentPlayerCount.projector([
          { player: { id: 'FAKE_ID' } } as QueueSlot,
        ]),
      ).toBe(1);
    });
  });

  describe('queueSlotsForClass', () => {
    it('should return all the right slots', () => {
      expect(
        queueSlotsForClass('soldier').projector([
          { gameClass: 'soldier' } as QueueSlot,
          { gameClass: 'scout' } as QueueSlot,
        ]),
      ).toEqual([{ gameClass: 'soldier' }] as QueueSlot[]);
    });
  });

  describe('slotById', () => {
    it('should return the right slot', () => {
      expect(
        slotById(1).projector([
          { id: 0, gameClass: 'scout' } as QueueSlot,
          { id: 1, gameClass: 'soldier' } as QueueSlot,
        ]),
      ).toEqual({ id: 1, gameClass: 'soldier' } as any);
    });
  });

  describe('mySlot', () => {
    it('should return the right slot', () => {
      expect(
        mySlot.projector({ id: 'FAKE_ID' } as Player, [
          { gameClass: 'soldier', player: { id: 'FAKE_ID' } } as QueueSlot,
          { gameClass: 'scout', player: { id: 'FAKE_ID_2' } } as QueueSlot,
          { gameClass: 'scout' } as QueueSlot,
        ]),
      ).toEqual({
        gameClass: 'soldier',
        player: { id: 'FAKE_ID' },
      } as QueueSlot);
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
    },
  ];

  describe('mapVoteResults', () => {
    it('should return results', () => {
      expect(
        mapVoteResults.projector({
          mapVoteResults: results,
        } as State),
      ).toEqual(results);
    });
  });

  describe('mapVoteTotalCount', () => {
    it('should calculate the correct value', () => {
      expect(mapVoteTotalCount.projector(results)).toEqual(2);
    });
  });

  describe('mapVote', () => {
    it('should return mapVote', () => {
      expect(mapVote.projector({ mapVote: 'fake_map' } as State)).toEqual(
        'fake_map',
      );
    });
  });

  describe('isPreReadied', () => {
    it('should return preReady', () => {
      expect(isPreReadied.projector({ preReady: true } as State)).toEqual(true);
      expect(isPreReadied.projector({ preReady: false } as State)).toEqual(
        false,
      );
    });
  });

  describe('substituteRequests', () => {
    const requests = [
      {
        gameId: '5e1fb93d9cacb6d6e08bc6bf',
        gameNumber: 514,
        gameClass: 'soldier',
        team: 'BLU',
      },
    ];

    it('should return substitute requests', () => {
      expect(
        substituteRequests.projector({ substituteRequests: requests } as State),
      ).toEqual(requests);
    });
  });

  describe('friendships', () => {
    it('should pluck friendships', () => {
      const friendships = [
        {
          sourcePlayerId: 'SOURCE_PLAYER_ID',
          targetPlayerId: 'TARGET_PLAYER_ID',
        },
      ];
      expect(
        queueFriendships.projector({
          slots: [],
          state: 'waiting',
          friendships,
        } as State),
      ).toEqual(friendships);
    });
  });
});
