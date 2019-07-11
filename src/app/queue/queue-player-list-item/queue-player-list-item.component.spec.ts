import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QueuePlayerListItemComponent } from './queue-player-list-item.component';

describe('QueuePlayerListItemComponent', () => {
  let component: QueuePlayerListItemComponent;
  let fixture: ComponentFixture<QueuePlayerListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QueuePlayerListItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QueuePlayerListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
