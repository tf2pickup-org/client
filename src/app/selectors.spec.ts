import { Player } from './players/models/player';
import { QueueSlot } from './queue/models/queue-slot';
import { canJoinQueue, awaitsReadyUp } from './selectors';
import { Tf2ClassName } from './shared/models/tf2-class-name';

describe('canJoinQueue()', () => {
  describe('when the user is offline', () => {
    it('should return false', () => {
      expect(
        canJoinQueue(Tf2ClassName.soldier).projector(
          false,
          true,
          null,
          false,
          [],
        ),
      ).toBe(false);
    });
  });

  describe('when the user is not logged in', () => {
    it('should return false', () => {
      expect(
        canJoinQueue(Tf2ClassName.soldier).projector(
          true,
          false,
          null,
          false,
          [],
        ),
      ).toBe(false);
    });
  });

  describe('when the user has an active game', () => {
    it('should return false', () => {
      expect(
        canJoinQueue(Tf2ClassName.soldier).projector(
          true,
          true,
          'FAKE_GAME_ID',
          false,
          [],
        ),
      ).toBe(false);
    });
  });

  describe('when the user has active bans', () => {
    it('should return false', () => {
      expect(
        canJoinQueue(Tf2ClassName.soldier).projector(
          true,
          true,
          null,
          true,
          [],
        ),
      ).toBe(false);
    });
  });

  describe('when the user has restrictions', () => {
    it('should return false', () => {
      expect(
        canJoinQueue(Tf2ClassName.soldier).projector(true, true, null, false, [
          {
            reason: 'account needs review',
            gameClasses: [Tf2ClassName.soldier],
          },
        ]),
      ).toBe(false);
    });
  });
});

describe('awaitsReadyUp', () => {
  let mySlot: QueueSlot;

  describe('when the user is in the queue', () => {
    beforeEach(() => {
      mySlot = {
        id: 0,
        gameClass: Tf2ClassName.soldier,
        player: {
          id: 'FAKE_PLAYER_ID',
        } as Player,
        ready: false,
      };
    });

    describe('when the queue is in ready state', () => {
      describe('when the user is not ready', () => {
        beforeEach(() => (mySlot.ready = false));

        it('should return true', () => {
          expect(awaitsReadyUp.projector('ready', mySlot)).toBe(true);
        });
      });

      describe('when the user is ready', () => {
        beforeEach(() => (mySlot.ready = true));

        it('should return false', () => {
          expect(awaitsReadyUp.projector('ready', mySlot)).toBe(false);
        });
      });
    });

    describe('when the queue is in waiting state', () => {
      it('should return false', () => {
        expect(awaitsReadyUp.projector('waiting', mySlot)).toBe(false);
      });
    });

    describe('when the queue is in launching state', () => {
      it('should return false', () => {
        expect(awaitsReadyUp.projector('launching', mySlot)).toBe(false);
      });
    });
  });

  describe('when the user is not in the queue', () => {
    beforeEach(() => {
      mySlot = null;
    });

    it('should return false', () => {
      expect(awaitsReadyUp.projector('waiting', mySlot)).toBe(false);
      expect(awaitsReadyUp.projector('ready', mySlot)).toBe(false);
      expect(awaitsReadyUp.projector('launching', mySlot)).toBe(false);
    });
  });
});
