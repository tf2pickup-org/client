import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { QueueNotificationsControllerComponent } from './queue-notifications-controller.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { NotificationsService } from '@app/notifications/notifications.service';
import { SoundPlayerService, Sound } from '@app/notifications/sound-player.service';
import { MemoizedSelector, Store } from '@ngrx/store';
import { substituteRequests } from '../queue.selectors';
import { isPlayingGame } from '@app/games/games.selectors';

class NotificationsServiceStub {
  showNotification(title: string, options: any) { }
}

class SoundPlayerServiceStub {
  playSound(sound: any) { }
}

describe('QueueNotificationsControllerComponent', () => {
  let component: QueueNotificationsControllerComponent;
  let fixture: ComponentFixture<QueueNotificationsControllerComponent>;
  let store: MockStore;
  let substituteRequestsSelector: MemoizedSelector<unknown, any[]>;
  let isPlayingGameSelector: MemoizedSelector<unknown, boolean>;
  let notificationsService: NotificationsServiceStub;
  let soundPlayerService: SoundPlayerServiceStub;
  let showNotificationSpy: jasmine.Spy;
  let playSoundSpy: jasmine.Spy;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ QueueNotificationsControllerComponent ],
      providers: [
        provideMockStore(),
        { provide: NotificationsService, useClass: NotificationsServiceStub },
        { provide: SoundPlayerService, useClass: SoundPlayerServiceStub },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.get(Store);
    substituteRequestsSelector = store.overrideSelector(substituteRequests, []);
    isPlayingGameSelector = store.overrideSelector(isPlayingGame, false);

    fixture = TestBed.createComponent(QueueNotificationsControllerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    notificationsService = TestBed.get(NotificationsService);
    soundPlayerService = TestBed.get(SoundPlayerService);

    showNotificationSpy = spyOn(notificationsService, 'showNotification');
    playSoundSpy = spyOn(soundPlayerService, 'playSound');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when not playing any game', () => {
    it('should notify a user then there are new substitution requests', fakeAsync(() => {
      substituteRequestsSelector.setResult([{ }]);
      store.refreshState();
      tick(1000);

      expect(showNotificationSpy).toHaveBeenCalled();
      expect(playSoundSpy).toHaveBeenCalledWith(Sound.cmonToughGuy);
    }));

    it('should do nothing when the substitution requests disappear', fakeAsync(() => {
      substituteRequestsSelector.setResult([]);
      store.refreshState();
      tick(1000);

      expect(showNotificationSpy).not.toHaveBeenCalled();
      expect(playSoundSpy).not.toHaveBeenCalled();
    }));
  });

  describe('when playing a game', () => {
    beforeEach(() => {
      isPlayingGameSelector.setResult(true);
      store.refreshState();
    });

    it('should not notify when there are new substitution requests', fakeAsync(() => {
      substituteRequestsSelector.setResult([{ }]);
      store.refreshState();
      tick(1000);

      expect(showNotificationSpy).not.toHaveBeenCalled();
      expect(playSoundSpy).not.toHaveBeenCalled();
    }));
  });
});
