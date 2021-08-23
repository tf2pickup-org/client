import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlinePlayerListComponent } from './online-player-list.component';

describe('OnlinePlayerListComponent', () => {
  let component: OnlinePlayerListComponent;
  let fixture: ComponentFixture<OnlinePlayerListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnlinePlayerListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlinePlayerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
