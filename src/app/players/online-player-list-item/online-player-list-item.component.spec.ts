import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlinePlayerListItemComponent } from './online-player-list-item.component';

describe('OnlinePlayerListItemComponent', () => {
  let component: OnlinePlayerListItemComponent;
  let fixture: ComponentFixture<OnlinePlayerListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnlinePlayerListItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlinePlayerListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
