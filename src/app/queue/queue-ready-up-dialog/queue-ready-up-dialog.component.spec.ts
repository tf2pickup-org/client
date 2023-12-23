import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {
  QueueReadyUpAction,
  QueueReadyUpDialogComponent,
} from './queue-ready-up-dialog.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { By } from '@angular/platform-browser';

describe('QueueReadyUpDialogComponent', () => {
  let component: QueueReadyUpDialogComponent;
  let fixture: ComponentFixture<QueueReadyUpDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [QueueReadyUpDialogComponent],
      providers: [provideMockStore()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QueueReadyUpDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => TestBed.inject(MockStore)?.resetSelectors());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when user readies up', () => {
    let readyUpButton: HTMLButtonElement;

    beforeEach(() => {
      readyUpButton = fixture.debugElement.query(By.css('.ready-up-button'))
        .nativeElement as HTMLButtonElement;
    });

    it('should emit ready up', () => {
      component.action.subscribe(action =>
        expect(action).toEqual(QueueReadyUpAction.readyUp),
      );
      readyUpButton.click();
    });
  });

  describe('when user leaves the queue', () => {
    let leaveQueueButton: HTMLButtonElement;

    beforeEach(() => {
      leaveQueueButton = fixture.debugElement.query(
        By.css('.leave-queue-button'),
      ).nativeElement as HTMLButtonElement;
    });

    it('should emit leave queue', () => {
      component.action.subscribe(action =>
        expect(action).toEqual(QueueReadyUpAction.leaveQueue),
      );
      leaveQueueButton.click();
    });
  });
});
