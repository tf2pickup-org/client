import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { QueueStatusComponent } from './queue-status.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { Store } from '@ngrx/store';
import { queueCurrentPlayerCount, queueRequiredPlayerCount, queueState, queueMap } from '../queue.selectors';

describe('QueueStatusComponent', () => {
  let component: QueueStatusComponent;
  let fixture: ComponentFixture<QueueStatusComponent>;
  let store: MockStore<any>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QueueStatusComponent ],
      providers: [
        provideMockStore(),
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.get(Store);
    store.overrideSelector(queueCurrentPlayerCount, 0);
    store.overrideSelector(queueRequiredPlayerCount, 12);
    store.overrideSelector(queueState, 'waiting');
    store.overrideSelector(queueMap, 'FAKE_MAP');

    fixture = TestBed.createComponent(QueueStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
