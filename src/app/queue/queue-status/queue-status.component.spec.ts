import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { QueueStatusComponent } from './queue-status.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { isInQueue, queueCurrentPlayerCount, queueRequiredPlayerCount } from '../queue.selectors';
import { MemoizedSelector } from '@ngrx/store';
import { AppState } from '@app/app.state';
import { MockComponent } from 'ng-mocks';
import { PreReadyUpButtonComponent } from '../pre-ready-up-button/pre-ready-up-button.component';

describe('QueueStatusComponent', () => {
  let component: QueueStatusComponent;
  let fixture: ComponentFixture<QueueStatusComponent>;
  let store: MockStore<any>;
  let isInQueueSelector: MemoizedSelector<AppState, boolean>;

  const initialState = { queue: { loading: true }};

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        QueueStatusComponent,
        MockComponent(PreReadyUpButtonComponent),
      ],
      imports: [ RouterTestingModule ],
      providers: [
        provideMockStore({
          initialState,
          selectors: [
            { selector: queueCurrentPlayerCount, value: 2 },
            { selector: queueRequiredPlayerCount, value: 12 },
          ],
        }),
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.inject(MockStore);
    isInQueueSelector = store.overrideSelector(isInQueue, false);
    fixture = TestBed.createComponent(QueueStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when loading', () => {
    it('should apply correct css class', () => {
      const div = fixture.debugElement.query(By.css('.queue-status')).nativeElement as HTMLDivElement;
      expect(div.classList.contains('loading')).toBe(true);
    });

    it('should render ghost line', () => {
      expect(By.css('.ghost-line')).toBeTruthy();
    });
  });

  describe('when the queue is loaded', () => {
    describe('when the queue is in waiting state', () => {
      beforeEach(() => {
        store.setState({ queue: { loading: false, state: 'waiting' } });
        fixture.detectChanges();
      });

      it('should apply corrent css class', () => {
        const div = fixture.debugElement.query(By.css('.queue-status')).nativeElement as HTMLDivElement;
        expect(div.classList.contains('waiting')).toBe(true);
      });

      describe('when the player is in the queue', () => {
        beforeEach(() => {
          isInQueueSelector.setResult(true);
          store.refreshState();
          fixture.detectChanges();
        });

        it('should render the pre-ready up button', () => {
          expect(fixture.debugElement.query(By.css('app-pre-ready-up-button'))).toBeTruthy();
        });
      });
    });

    describe('when the queue is in ready state', () => {
      beforeEach(() => {
        store.setState({ queue: { loading: false, state: 'ready' } });
        fixture.detectChanges();
      });

      it('should apply correct css class', () => {
        const div = fixture.debugElement.query(By.css('.queue-status')).nativeElement as HTMLDivElement;
        expect(div.classList.contains('ready')).toBe(true);
      });
    });

    describe('when the queue is in launching state', () => {
      beforeEach(() => {
        store.setState({ queue: { loading: false, state: 'launching' } });
        fixture.detectChanges();
      });

      it('should apply correct css class', () => {
        const div = fixture.debugElement.query(By.css('.queue-status')).nativeElement as HTMLDivElement;
        expect(div.classList.contains('launching')).toBe(true);
      });
    });
  });
});
