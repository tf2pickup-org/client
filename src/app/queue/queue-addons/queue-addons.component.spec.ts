import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { QueueAddonsComponent } from './queue-addons.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('QueueAddonsComponent', () => {
  let component: QueueAddonsComponent;
  let fixture: ComponentFixture<QueueAddonsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ QueueAddonsComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QueueAddonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
