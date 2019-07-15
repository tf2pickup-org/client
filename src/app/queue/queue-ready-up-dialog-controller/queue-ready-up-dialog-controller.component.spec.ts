import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QueueReadyUpDialogControllerComponent } from './queue-ready-up-dialog-controller.component';

describe('QueueReadyUpDialogControllerComponent', () => {
  let component: QueueReadyUpDialogControllerComponent;
  let fixture: ComponentFixture<QueueReadyUpDialogControllerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QueueReadyUpDialogControllerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QueueReadyUpDialogControllerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
