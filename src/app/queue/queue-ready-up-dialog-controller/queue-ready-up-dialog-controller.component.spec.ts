import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { QueueReadyUpDialogControllerComponent } from './queue-ready-up-dialog-controller.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Store, MemoizedSelector } from '@ngrx/store';
import { NotificationsService } from '@app/notifications/notifications.service';
import { SoundPlayerService, Sound } from '@app/notifications/sound-player.service';
import { AppState } from '@app/app.state';
import { queueShowReadyUpDialog } from '../queue.selectors';
import { QueueReadyUpDialogComponent } from '../queue-ready-up-dialog/queue-ready-up-dialog.component';

class BsModalServiceStub {
  show(component: any, options?: any) { return this; }
  hide() { }
}

class NotificationsServiceStub {
  showNotification(title: string, options: any) { }
}

class SoundPlayerServiceStub {
  playSound(sound: any) { }
}

describe('QueueReadyUpDialogControllerComponent', () => {
  let component: QueueReadyUpDialogControllerComponent;
  let fixture: ComponentFixture<QueueReadyUpDialogControllerComponent>;
  let store: MockStore<any>;
  let queueShowReadyUpDialogSelector: MemoizedSelector<AppState, boolean>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ QueueReadyUpDialogControllerComponent ],
      providers: [
        provideMockStore(),
        { provide: BsModalService, useClass: BsModalServiceStub },
        { provide: NotificationsService, useClass: NotificationsServiceStub },
        { provide: SoundPlayerService, useClass: SoundPlayerServiceStub },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.get(Store);
    queueShowReadyUpDialogSelector = store.overrideSelector(queueShowReadyUpDialog, false);

    fixture = TestBed.createComponent(QueueReadyUpDialogControllerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the ready up dialog and notify user', () => {
    const showSpy = spyOn(TestBed.get(BsModalService), 'show');
    const showNotificationSpy = spyOn(TestBed.get(NotificationsService), 'showNotification');
    const playSoundSpy = spyOn(TestBed.get(SoundPlayerService), 'playSound');

    queueShowReadyUpDialogSelector.setResult(true);
    store.refreshState();

    expect(showSpy).toHaveBeenCalledWith(QueueReadyUpDialogComponent, jasmine.any(Object));
    expect(showNotificationSpy).toHaveBeenCalled();
    expect(playSoundSpy).toHaveBeenCalledWith(Sound.ReadyUp);
  });

  describe('when the ready up phase is over', () => {
    beforeEach(() => {
      queueShowReadyUpDialogSelector.setResult(true);
      store.refreshState();
    });

    it('should hide the dialog', () => {
      const hideSpy = spyOn(TestBed.get(BsModalService), 'hide');

      queueShowReadyUpDialogSelector.setResult(false);
      store.refreshState();

      expect(hideSpy).toHaveBeenCalled();
    });
  });
});
