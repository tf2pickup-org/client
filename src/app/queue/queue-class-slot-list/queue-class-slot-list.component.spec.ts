import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QueueClassSlotListComponent } from './queue-class-slot-list.component';

describe('QueueClassSlotListComponent', () => {
  let component: QueueClassSlotListComponent;
  let fixture: ComponentFixture<QueueClassSlotListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QueueClassSlotListComponent ]
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
