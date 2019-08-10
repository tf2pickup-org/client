import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PlayerStatsComponent } from './player-stats.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('PlayerStatsComponent', () => {
  let component: PlayerStatsComponent;
  let fixture: ComponentFixture<PlayerStatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayerStatsComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
