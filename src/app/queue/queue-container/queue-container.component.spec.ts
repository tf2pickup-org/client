import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QueueContainerComponent } from './queue-container.component';

describe('QueueContainerComponent', () => {
  let component: QueueContainerComponent;
  let fixture: ComponentFixture<QueueContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QueueContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QueueContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
