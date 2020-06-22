import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerDetailsAdminButtonsComponent } from './player-details-admin-buttons.component';

describe('PlayerDetailsAdminButtonsComponent', () => {
  let component: PlayerDetailsAdminButtonsComponent;
  let fixture: ComponentFixture<PlayerDetailsAdminButtonsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayerDetailsAdminButtonsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerDetailsAdminButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
