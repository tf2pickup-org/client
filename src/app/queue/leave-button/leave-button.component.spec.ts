import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveButtonComponent } from './leave-button.component';

describe('LeaveButtonComponent', () => {
  let component: LeaveButtonComponent;
  let fixture: ComponentFixture<LeaveButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeaveButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
