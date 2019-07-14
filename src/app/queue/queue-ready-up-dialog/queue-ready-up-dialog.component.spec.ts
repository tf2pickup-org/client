import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QueueReadyUpDialogComponent } from './queue-ready-up-dialog.component';

describe('QueueReadyUpDialogComponent', () => {
  let component: QueueReadyUpDialogComponent;
  let fixture: ComponentFixture<QueueReadyUpDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QueueReadyUpDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QueueReadyUpDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
