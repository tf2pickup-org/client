import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { QueueClassSlotListComponent } from './queue-class-slot-list.component';
import { provideMockStore } from '@ngrx/store/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { queueLocked } from '@app/selectors';

describe('QueueClassSlotListComponent', () => {
  let component: QueueClassSlotListComponent;
  let fixture: ComponentFixture<QueueClassSlotListComponent>;

  const initialState = {
    profile: { profile: { id: 'FAKE_ID' } },
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QueueClassSlotListComponent ],
      providers: [
        provideMockStore({
          initialState,
          selectors: [
            { selector: queueLocked, value: false },
          ],
        }),
      ],
      schemas: [ NO_ERRORS_SCHEMA ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QueueClassSlotListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reflect queue locked state', async(() => {
    component.locked.subscribe(value => expect(value).toBe(false));
  }));

  describe('#ngOnInit()', () => {
    it('should retrieve currentPlayerId', () => {
      component.ngOnInit();
      expect(component.currentPlayerId).toEqual('FAKE_ID');
    });
  });
});
