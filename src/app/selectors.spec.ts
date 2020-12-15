import { QueueSlot } from './queue/models/queue-slot';
import { queueLocked, canSubstituteInGame, isReadyUpDialogShown } from './selectors';

describe('queueLocked', () => {
  describe('when the user is not logged in', () => {
    it('should return true', () => {
      expect(queueLocked.projector(null, null)).toBe(true);
    });
  });

  describe('when the user has an active game', () => {
    it('should return true', () => {
      expect(queueLocked.projector({ }, { })).toBe(true);
    });
  });

  describe('when the user has active bans', () => {
    it('should return true', () => {
      expect(queueLocked.projector({ bans: [{ }] }, null)).toBe(true);
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

describe('isReadyUpDialogShown', () => {
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
            expect(isReadyUpDialogShown.projector('ready', mySlot, false)).toBe(true);
          });
        });

        describe('when is pre-readied', () => {
          it('should return false', () => {
            expect(isReadyUpDialogShown.projector('ready', mySlot, true)).toBe(false);
          });
        });
      });

      describe('when the user is ready', () => {
        beforeEach(() => mySlot.ready = true);

        it('should return false', () => {
          expect(isReadyUpDialogShown.projector('ready', mySlot, false)).toBe(false);
          expect(isReadyUpDialogShown.projector('ready', mySlot, true)).toBe(false);
        });
      });
    });

    describe('when the queue is in waiting state', () => {
      it('should return false', () => {
        expect(isReadyUpDialogShown.projector('waiting', mySlot, false)).toBe(false);
        expect(isReadyUpDialogShown.projector('waiting', mySlot, true)).toBe(false);
      });
    });

    describe('when the queue is in launching state', () => {
      it('should return false', () => {
        expect(isReadyUpDialogShown.projector('launching', mySlot, false)).toBe(false);
        expect(isReadyUpDialogShown.projector('launching', mySlot, true)).toBe(false);
      });
    });
  });

  describe('when the user is not in the queue', () => {
    beforeEach(() => {
      mySlot = null;
    });

    it('should return false', () => {
      expect(isReadyUpDialogShown.projector('waiting', mySlot, true)).toBe(false);
      expect(isReadyUpDialogShown.projector('waiting', mySlot, false)).toBe(false);
      expect(isReadyUpDialogShown.projector('ready', mySlot, true)).toBe(false);
      expect(isReadyUpDialogShown.projector('ready', mySlot, false)).toBe(false);
      expect(isReadyUpDialogShown.projector('launching', mySlot, true)).toBe(false);
      expect(isReadyUpDialogShown.projector('launching', mySlot, false)).toBe(false);
    });
  });
});
