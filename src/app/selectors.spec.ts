import { QueueSlot } from './queue/models/queue-slot';
import { canJoinQueue, awaitsReadyUp } from './selectors';

describe('canJoinQueue', () => {
  describe('when the user is not logged in', () => {
    it('should return false', () => {
      expect(canJoinQueue.projector(false, null, false)).toBe(false);
    });
  });

  describe('when the user has an active game', () => {
    it('should return false', () => {
      expect(canJoinQueue.projector(true, { }, false)).toBe(false);
    });
  });

  describe('when the user has active bans', () => {
    it('should return false', () => {
      expect(canJoinQueue.projector(true, null, true)).toBe(false);
    });
  });
});

describe('awaitsReadyUp', () => {
  let mySlot: QueueSlot;

  describe('when the user is in the queue', () => {
    beforeEach(() => {
      mySlot = { id: 0, gameClass: 'soldier', playerId: 'FAKE_PLAYER_ID', ready: false };
    });

    describe('when the queue is in ready state', () => {
      describe('when the user is not ready', () => {
        beforeEach(() => mySlot.ready = false);

        describe('when is not pre-readied', () => {
          it('should return true', () => {
            expect(awaitsReadyUp.projector('ready', mySlot, false)).toBe(true);
          });
        });

        describe('when is pre-readied', () => {
          it('should return false', () => {
            expect(awaitsReadyUp.projector('ready', mySlot, true)).toBe(false);
          });
        });
      });

      describe('when the user is ready', () => {
        beforeEach(() => mySlot.ready = true);

        it('should return false', () => {
          expect(awaitsReadyUp.projector('ready', mySlot, false)).toBe(false);
          expect(awaitsReadyUp.projector('ready', mySlot, true)).toBe(false);
        });
      });
    });

    describe('when the queue is in waiting state', () => {
      it('should return false', () => {
        expect(awaitsReadyUp.projector('waiting', mySlot, false)).toBe(false);
        expect(awaitsReadyUp.projector('waiting', mySlot, true)).toBe(false);
      });
    });

    describe('when the queue is in launching state', () => {
      it('should return false', () => {
        expect(awaitsReadyUp.projector('launching', mySlot, false)).toBe(false);
        expect(awaitsReadyUp.projector('launching', mySlot, true)).toBe(false);
      });
    });
  });

  describe('when the user is not in the queue', () => {
    beforeEach(() => {
      mySlot = null;
    });

    it('should return false', () => {
      expect(awaitsReadyUp.projector('waiting', mySlot, true)).toBe(false);
      expect(awaitsReadyUp.projector('waiting', mySlot, false)).toBe(false);
      expect(awaitsReadyUp.projector('ready', mySlot, true)).toBe(false);
      expect(awaitsReadyUp.projector('ready', mySlot, false)).toBe(false);
      expect(awaitsReadyUp.projector('launching', mySlot, true)).toBe(false);
      expect(awaitsReadyUp.projector('launching', mySlot, false)).toBe(false);
    });
  });
});
