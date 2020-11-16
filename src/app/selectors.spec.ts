import { QueueSlot } from './queue/models/queue-slot';
import { queueLocked, canSubstituteInGame, isReadyUpDialogShown } from './selectors';

describe('root selectors', () => {
  describe('queueLocked', () => {
    it('should return true if the user is not logged in', () => {
      expect(queueLocked.projector(null, null)).toBe(true);
    });

    it('should return true if the user has an active game', () => {
      expect(queueLocked.projector({ }, { })).toBe(true);
    });

    it('should return true if the user has active bans', () => {
      expect(queueLocked.projector({ bans: [{}] }, null)).toBe(true);
    });
  });

  describe('canSubstituteInGame', () => {
    it('should return false if the given game is not running', () => {
      expect(canSubstituteInGame('FAKE_GAME_ID').projector(false, false, null, null)).toBe(false);
    });

    it('should return false if the current user is banned', () => {
      expect(canSubstituteInGame('FAKE_GAME_ID').projector(true, true, null, null)).toBe(false);
    });

    it('should return true if the current user is not playing any game', () => {
      expect(canSubstituteInGame('FAKE_GAME_ID').projector(true, false, null, { id: 'FAKE_GAME_ID' })).toBe(true);
    });

    it('should return false if the current user is playing a game', () => {
      expect(canSubstituteInGame('FAKE_GAME_ID').projector(true, false, { id: 'SOME_OTHER_GAME' }, { id: 'FAKE_GAME_ID' })).toBe(false);
    });

    it('should return true if player is trying to sub in the same game', () => {
      expect(canSubstituteInGame('FAKE_GAME_ID').projector(true, false, { id: 'FAKE_GAME_ID' }, { id: 'FAKE_GAME_ID' })).toBe(true);
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
});
