import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { QueueStatusComponent } from './queue-status.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { Store } from '@ngrx/store';
import { queueCurrentPlayerCount, queueRequiredPlayerCount, queueState, queueMap, mapChangeVoterCount,
    isInQueue, queueConfig, votesForMapChange} from '../queue.selectors';
import { RouterTestingModule } from '@angular/router/testing';

fdescribe('QueueStatusComponent', () => {
  let component: QueueStatusComponent;
  let fixture: ComponentFixture<QueueStatusComponent>;
  let store: MockStore<any>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QueueStatusComponent ],
      imports: [ RouterTestingModule ],
      providers: [
        provideMockStore({
          selectors: [
            { selector: queueCurrentPlayerCount, value: 0 },
            { selector: queueRequiredPlayerCount, value: 12 },
            { selector: queueState, value: 'waiting' },
            { selector: queueMap, value: 'FAKE_MAP' },
            { selector: isInQueue, value: false },
            { selector: mapChangeVoterCount, value: 0 },
            { selector: queueConfig, value: { nextMapSuccessfulVoteThreshold: 7 } },
            { selector: votesForMapChange, value: false },
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
});
