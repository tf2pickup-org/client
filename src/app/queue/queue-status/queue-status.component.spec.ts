import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { QueueStatusComponent } from './queue-status.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import {
  isInQueue,
  queueCurrentPlayerCount,
  queueRequiredPlayerCount,
  queueState,
} from '../queue.selectors';
import { MemoizedSelector } from '@ngrx/store';
import { AppState } from '@app/app.state';
import { MockComponent } from 'ng-mocks';
import { PreReadyUpButtonComponent } from '../pre-ready-up-button/pre-ready-up-button.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('QueueStatusComponent', () => {
  let component: QueueStatusComponent;
  let fixture: ComponentFixture<QueueStatusComponent>;
  let store: MockStore;
  let isInQueueSelector: MemoizedSelector<AppState, boolean>;
  let queueStateSelector: MemoizedSelector<AppState, string>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        QueueStatusComponent,
        MockComponent(PreReadyUpButtonComponent),
      ],
      imports: [RouterTestingModule, NoopAnimationsModule],
      providers: [
        provideMockStore({
          selectors: [
            { selector: queueCurrentPlayerCount, value: 2 },
            { selector: queueRequiredPlayerCount, value: 12 },
          ],
        }),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.inject(MockStore);
    isInQueueSelector = store.overrideSelector(isInQueue, false);
    queueStateSelector = store.overrideSelector(queueState, 'loading');

    fixture = TestBed.createComponent(QueueStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => TestBed.inject(MockStore)?.resetSelectors());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when loading', () => {
    it('should apply correct css class', () => {
      const div = fixture.debugElement.query(By.css('.queue-status'))
        .nativeElement as HTMLDivElement;
      expect(div.classList.contains('waiting')).toBe(true);
    });

    it('should render ghost line', () => {
      expect(By.css('.queue-status__ghost')).toBeTruthy();
    });
  });

  describe('when the queue is in waiting state', () => {
    beforeEach(() => {
      queueStateSelector.setResult('waiting');
      store.refreshState();
      fixture.detectChanges();
    });

    it('should apply corrent css class', () => {
      const div = fixture.debugElement.query(By.css('.queue-status'))
        .nativeElement as HTMLDivElement;
      expect(div.classList.contains('waiting')).toBe(true);
    });

    describe('when the player is in the queue', () => {
      beforeEach(() => {
        isInQueueSelector.setResult(true);
        store.refreshState();
        fixture.detectChanges();
      });

      it('should render the pre-ready up button', () => {
        expect(
          fixture.debugElement.query(By.css('app-pre-ready-up-button')),
        ).toBeTruthy();
      });
    });
  });

  describe('when the queue is in ready state', () => {
    beforeEach(() => {
      queueStateSelector.setResult('ready');
      store.refreshState();
      fixture.detectChanges();
    });

    it('should apply correct css class', () => {
      const div = fixture.debugElement.query(By.css('.queue-status'))
        .nativeElement as HTMLDivElement;
      expect(div.classList.contains('ready')).toBe(true);
    });
  });

  describe('when the queue is in launching state', () => {
    beforeEach(() => {
      queueStateSelector.setResult('launching');
      store.refreshState();
      fixture.detectChanges();
    });

    it('should apply correct css class', () => {
      const div = fixture.debugElement.query(By.css('.queue-status'))
        .nativeElement as HTMLDivElement;
      expect(div.classList.contains('launching')).toBe(true);
    });
  });
});
