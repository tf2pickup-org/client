import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerDetailsBadgesComponent } from './player-details-badges.component';

describe('PlayerDetailsBadgesComponent', () => {
  let component: PlayerDetailsBadgesComponent;
  let fixture: ComponentFixture<PlayerDetailsBadgesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayerDetailsBadgesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerDetailsBadgesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
