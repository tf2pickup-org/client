import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { isPlayingGame } from '@app/games/games.selectors';
import { awaitsReadyUp } from '@app/selectors';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Howl } from 'howler';
import { Subject } from 'rxjs';
import { QueueReadyUpAction } from '../queue-ready-up-dialog/queue-ready-up-dialog.component';
import { leaveQueue, readyUp } from '../queue.actions';
import { substituteRequests } from '../queue.selectors';
import { ReadyUpService } from '../ready-up.service';
import { QueueNotificationsHandlerComponent } from './queue-notifications-handler.component';

describe('QueueNotificationsHandlerComponent', () => {
  let component: QueueNotificationsHandlerComponent;
  let fixture: ComponentFixture<QueueNotificationsHandlerComponent>;
  let store: MockStore;
  let readyUpService: jasmine.SpyObj<ReadyUpService>;
  let readyUpResult: Subject<QueueReadyUpAction>;

  beforeEach(() => {
    readyUpResult = new Subject();
    readyUpService = jasmine.createSpyObj<ReadyUpService>(ReadyUpService.name, ['askUserToReadyUp']);
    readyUpService.askUserToReadyUp.and.returnValue(readyUpResult.asObservable());
  });

  beforeEach(() => {
    // @ts-ignore
    spyOn(Howl.prototype, 'init');
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QueueNotificationsHandlerComponent ],
      providers: [
        provideMockStore(),
        { provide: ReadyUpService, useValue: readyUpService },
      ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    store = TestBed.inject(MockStore);
    store.overrideSelector(awaitsReadyUp, false);
    store.overrideSelector(substituteRequests, []);
    store.overrideSelector(isPlayingGame, false);
    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(QueueNotificationsHandlerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when ready up is awaited', () => {
    beforeEach(fakeAsync(() => {
      awaitsReadyUp.setResult(true);
      store.refreshState();
      tick(100);
    }));

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

  describe('when a substitute is needed', () => {
    beforeEach(fakeAsync(() => {
      substituteRequests.setResult([
        { team: 'RED', gameClass: 'soldier', gameNumber: 1, gameId: 'FAKE_GAME_ID' },
      ]);
      store.refreshState();
      tick(1000);
    }));

    it('should play the sound', () => {
      // @ts-ignore
      expect(Howl.prototype.init).toHaveBeenCalledOnceWith({
        src: jasmine.any(Array),
        autoplay: true,
      });
    });
  });

  describe('when a substitute is needed, but the user is playing a game', () => {
    beforeEach(fakeAsync(() => {
      isPlayingGame.setResult(true);
      substituteRequests.setResult([
        { team: 'RED', gameClass: 'soldier', gameNumber: 1, gameId: 'FAKE_GAME_ID' },
      ]);
      store.refreshState();
      tick(1000);
    }));

    it('should not play the sound', () => {
      // @ts-ignore
      expect(Howl.prototype.init).not.toHaveBeenCalled();
    });
  });
});
