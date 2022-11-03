import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerActionLogsComponent } from './player-action-logs.component';

describe('PlayerActionLogsComponent', () => {
  let component: PlayerActionLogsComponent;
  let fixture: ComponentFixture<PlayerActionLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayerActionLogsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayerActionLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
