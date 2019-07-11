import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QueuePlayerListComponent } from './queue-player-list.component';

describe('QueuePlayerListComponent', () => {
  let component: QueuePlayerListComponent;
  let fixture: ComponentFixture<QueuePlayerListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QueuePlayerListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QueuePlayerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
