import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { isPlayingGame } from '@app/profile/profile.selectors';
import { awaitsReadyUp } from '@app/selectors';
import { SoundPlayerService } from '@app/shared/sound-player.service';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { of, Subject } from 'rxjs';
import { QueueReadyUpAction } from '../queue-ready-up-dialog/queue-ready-up-dialog.component';
import { leaveQueue, readyUp } from '../queue.actions';
import { isPreReadied, substituteRequests } from '../queue.selectors';
import { ReadyUpService } from '../ready-up.service';
import { QueueNotificationsHandlerComponent } from './queue-notifications-handler.component';

describe('QueueNotificationsHandlerComponent', () => {
  let component: QueueNotificationsHandlerComponent;
  let fixture: ComponentFixture<QueueNotificationsHandlerComponent>;
  let store: MockStore;
  let readyUpService: jasmine.SpyObj<ReadyUpService>;
  let readyUpResult: Subject<QueueReadyUpAction>;
  let soundPlayerService: jasmine.SpyObj<SoundPlayerService>;

  beforeEach(() => {
    readyUpResult = new Subject();
    readyUpService = jasmine.createSpyObj<ReadyUpService>(ReadyUpService.name, [
      'askUserToReadyUp',
    ]);
    readyUpService.askUserToReadyUp.and.returnValue(
      readyUpResult.asObservable(),
    );
    soundPlayerService = jasmine.createSpyObj<SoundPlayerService>(
      SoundPlayerService.name,
      ['playSound'],
    );
    soundPlayerService.playSound.and.returnValue(of());
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QueueNotificationsHandlerComponent],
      providers: [
        provideMockStore(),
        { provide: ReadyUpService, useValue: readyUpService },
        { provide: SoundPlayerService, useValue: soundPlayerService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    store = TestBed.inject(MockStore);
    store.overrideSelector(awaitsReadyUp, false);
    store.overrideSelector(isPreReadied, false);
    store.overrideSelector(substituteRequests, []);
    store.overrideSelector(isPlayingGame, false);
    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(QueueNotificationsHandlerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => TestBed.inject(MockStore)?.resetSelectors());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  const timeout = (ms: number) =>
    new Promise(resolve => setTimeout(resolve, ms));

  describe('when ready up is awaited', () => {
    describe('and the user is not pre-readied', () => {
      beforeEach(async () => {
        awaitsReadyUp.setResult(true);
        store.refreshState();
        await timeout(150);
        fixture.detectChanges();
      });

      it('should ask the user to ready up', () => {
        expect(readyUpService.askUserToReadyUp).toHaveBeenCalled();
      });

      describe('when the user readies up', () => {
        beforeEach(() => {
          readyUpResult.next(QueueReadyUpAction.readyUp);
        });

        it('should dispatch the readyUp action', () => {
          expect(store.dispatch).toHaveBeenCalledWith(readyUp());
        });
      });

      describe('when the user does not ready up', () => {
        beforeEach(() => {
          readyUpResult.next(QueueReadyUpAction.leaveQueue);
        });

        it('should dispatch the leaveQueue action', () => {
          expect(store.dispatch).toHaveBeenCalledWith(leaveQueue());
        });
      });
    });

    describe('and the user is pre-readied', () => {
      beforeEach(async () => {
        isPreReadied.setResult(true);
        awaitsReadyUp.setResult(true);
        store.refreshState();
        await timeout(150);
      });

      it('should not ask the user to ready up', () => {
        expect(readyUpService.askUserToReadyUp).not.toHaveBeenCalled();
      });

      it('should ready up immediately', () => {
        expect(store.dispatch).toHaveBeenCalledWith(readyUp());
      });
    });
  });

  describe('when a substitute is needed', () => {
    beforeEach(fakeAsync(() => {
      substituteRequests.setResult([
        {
          team: 'RED',
          gameClass: 'soldier',
          gameNumber: 1,
          gameId: 'FAKE_GAME_ID',
        },
      ]);
      store.refreshState();
      tick(1000);
    }));

    it('should play the sound', () => {
      expect(soundPlayerService.playSound).toHaveBeenCalledTimes(1);
    });
  });

  describe('when a substitute is needed, but the user is playing a game', () => {
    beforeEach(fakeAsync(() => {
      isPlayingGame.setResult(true);
      substituteRequests.setResult([
        {
          team: 'RED',
          gameClass: 'soldier',
          gameNumber: 1,
          gameId: 'FAKE_GAME_ID',
        },
      ]);
      store.refreshState();
      tick(1000);
    }));

    it('should not play the sound', () => {
      expect(soundPlayerService.playSound).not.toHaveBeenCalled();
    });
  });
});
