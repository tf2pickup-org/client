import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PlayerConnectionStatusComponent } from './player-connection-status.component';

describe('PlayerConnectionStatusComponent', () => {
  let component: PlayerConnectionStatusComponent;
  let fixture: ComponentFixture<PlayerConnectionStatusComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayerConnectionStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerConnectionStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
