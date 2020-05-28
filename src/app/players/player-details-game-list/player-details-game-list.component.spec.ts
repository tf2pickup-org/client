import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerDetailsGameListComponent } from './player-details-game-list.component';

describe('PlayerDetailsGameListComponent', () => {
  let component: PlayerDetailsGameListComponent;
  let fixture: ComponentFixture<PlayerDetailsGameListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayerDetailsGameListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerDetailsGameListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
