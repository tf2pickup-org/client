import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { QueueStatusComponent } from './queue-status.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { Store } from '@ngrx/store';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { queueCurrentPlayerCount, queueRequiredPlayerCount } from '../queue.selectors';

describe('QueueStatusComponent', () => {
  let component: QueueStatusComponent;
  let fixture: ComponentFixture<QueueStatusComponent>;
  let store: MockStore<any>;

  const initialState = { queue: { state: 'waiting' }};

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ QueueStatusComponent ],
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
    store = TestBed.get(Store);
    fixture = TestBed.createComponent(QueueStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('should apply correct css classes', () => {
    it('when the queue is waiting', () => {
      const el = fixture.debugElement.query(By.css('div')).nativeElement as HTMLDivElement;
      expect(el.classList.contains('bg-info')).toBe(true);
    });

    it('when the queue is ready', () => {
      store.setState({ queue: { state: 'ready' }});
      fixture.detectChanges();
      const el = fixture.debugElement.query(By.css('div')).nativeElement as HTMLDivElement;
      expect(el.classList.contains('bg-success')).toBe(true);
    });

    it('when the queue is launching', () => {
      store.setState({ queue: { state: 'launching' }});
      fixture.detectChanges();
      const el = fixture.debugElement.query(By.css('div')).nativeElement as HTMLDivElement;
      expect(el.classList.contains('bg-dark')).toBe(true);
    });
  });
});
