import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinOrLeaveQueueComponent } from './join-or-leave-queue.component';

describe('JoinOrLeaveQueueComponent', () => {
  let component: JoinOrLeaveQueueComponent;
  let fixture: ComponentFixture<JoinOrLeaveQueueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JoinOrLeaveQueueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinOrLeaveQueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
