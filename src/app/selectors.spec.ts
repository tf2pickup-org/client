import { QueueSlot } from './queue/models/queue-slot';
import { canJoinQueue, canSubstituteInGame, awaitsReadyUp } from './selectors';

fdescribe('canJoinQueue', () => {
  describe('when the user is not logged in', () => {
    it('should return false', () => {
      expect(canJoinQueue.projector(null, null)).toBe(false);
    });
  });

  describe('when the user has an active game', () => {
    it('should return false', () => {
      expect(canJoinQueue.projector({ }, { })).toBe(false);
    });
  });

  describe('when the user has active bans', () => {
    it('should return false', () => {
      expect(canJoinQueue.projector({ bans: [{ }] }, null)).toBe(false);
    });
  });
});

describe('canSubstituteInGame', () => {
  describe('when not logged in', () => {
    it('should return false', () => {
      expect(canSubstituteInGame('FAKE_GAME_ID').projector(false, true, false, null, { id: 'FAKE_GAME_ID' })).toBe(false);
    });
  });

  describe('when logged in', () => {
    describe('when the given game is not runnong', () => {
      it('should return false', () => {
        expect(canSubstituteInGame('FAKE_GAME_ID').projector(true, false, false, null, null)).toBe(false);
      });
    });

    describe('when the user is banned', () => {
      it('should return false', () => {
        expect(canSubstituteInGame('FAKE_GAME_ID').projector(true, true, true, null, null)).toBe(false);
      });
    });

    describe('when the user is not playing any game', () => {
      it('should return true', () => {
        expect(canSubstituteInGame('FAKE_GAME_ID').projector(true, true, false, null, { id: 'FAKE_GAME_ID' })).toBe(true);
      });
    });

    describe('when the user is playing a game', () => {
      it('should return false', () => {
        expect(canSubstituteInGame('FAKE_GAME_ID').projector(true, true, false, { id: 'SOME_OTHER_GAME' }, { id: 'FAKE_GAME_ID' }))
          .toBe(false);
      });
    });

    describe('when the user is trying to sub in the same game', () => {
      it('should return true', () => {
        expect(canSubstituteInGame('FAKE_GAME_ID').projector(true, true, false, { id: 'FAKE_GAME_ID' }, { id: 'FAKE_GAME_ID' }))
          .toBe(true);
      });
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
