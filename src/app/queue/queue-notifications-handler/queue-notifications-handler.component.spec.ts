import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueueNotificationsHandlerComponent } from './queue-notifications-handler.component';

describe('QueueNotificationsHandlerComponent', () => {
  let component: QueueNotificationsHandlerComponent;
  let fixture: ComponentFixture<QueueNotificationsHandlerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QueueNotificationsHandlerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QueueNotificationsHandlerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
