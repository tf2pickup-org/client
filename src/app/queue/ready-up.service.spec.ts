import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TestBed } from '@angular/core/testing';
import { SoundPlayerService } from '@app/shared/sound-player.service';
import { of, Subscription } from 'rxjs';
import { QueueReadyUpAction, QueueReadyUpDialogComponent } from './queue-ready-up-dialog/queue-ready-up-dialog.component';
import { ReadyUpService } from './ready-up.service';

describe('ReadyUpService', () => {
  let service: ReadyUpService;
  let overlayService: jasmine.SpyObj<Overlay>;
  let overlayRef: jasmine.SpyObj<OverlayRef>;
  let soundPlayerService: jasmine.SpyObj<SoundPlayerService>;
  let component: QueueReadyUpDialogComponent;

  beforeEach(() => {
    overlayService = jasmine.createSpyObj<Overlay>(Overlay.name, ['create']);
    overlayRef = jasmine.createSpyObj<OverlayRef>(OverlayRef.name, ['attach', 'dispose']);
    soundPlayerService = jasmine.createSpyObj(SoundPlayerService.name, ['playSound']);
    component = new QueueReadyUpDialogComponent();

    overlayService.create.and.returnValue(overlayRef);
    overlayRef.attach.and.returnValue({
      instance: component,
    });
    soundPlayerService.playSound.and.returnValue(of(null));
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: Overlay, useValue: overlayService },
        { provide: SoundPlayerService, useValue: soundPlayerService },
      ],
    });
    service = TestBed.inject(ReadyUpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#askUserToReadyUp()', () => {
    let subscription: Subscription;
    let lastAction: QueueReadyUpAction;

    beforeEach(() => {
      lastAction = null;
      subscription = service.askUserToReadyUp().subscribe(action => lastAction = action);
    });

    it('should play the ready-up sound', () => {
      expect(soundPlayerService.playSound).toHaveBeenCalledTimes(1);

      const src = soundPlayerService.playSound.calls.first().args[0];
      expect(src.every(file => /ready_up\./.test(file)));
    });

    describe('when user readies up', () => {
      beforeEach(() => {
        component.action.next(QueueReadyUpAction.readyUp);
      });

      it('should emit readyUp', () => {
        expect(lastAction).toEqual(QueueReadyUpAction.readyUp);
      });

      it('should close the dialog', () => {
        expect(overlayRef.dispose).toHaveBeenCalled();
      });
    });

    describe('when user leaves the queue', () => {
      beforeEach(() => {
        component.action.next(QueueReadyUpAction.leaveQueue);
      });

      it('should emit leaveQueue', () => {
        expect(lastAction).toEqual(QueueReadyUpAction.leaveQueue);
      });

      it('should close the dialog', () => {
        expect(overlayRef.dispose).toHaveBeenCalled();
      });
    });

    describe('when is unsubscribed', () => {
      beforeEach(() => {
        subscription.unsubscribe();
      });

      it('should close the dialog', () => {
        expect(overlayRef.dispose).toHaveBeenCalled();
      });
    });
  });
});
