import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QueueSlotItemComponent } from './queue-slot-item.component';

describe('QueueSlotItemComponent', () => {
  let component: QueueSlotItemComponent;
  let fixture: ComponentFixture<QueueSlotItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QueueSlotItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QueueSlotItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
