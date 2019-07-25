import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { QueueClassSlotListComponent } from './queue-class-slot-list.component';
import { provideMockStore } from '@ngrx/store/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('QueueClassSlotListComponent', () => {
  let component: QueueClassSlotListComponent;
  let fixture: ComponentFixture<QueueClassSlotListComponent>;

  const initialState = {
    queue: { locked: false },
    profile: { id: 'FAKE_ID' },
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QueueClassSlotListComponent ],
      providers: [
        provideMockStore({ initialState }),
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
});
