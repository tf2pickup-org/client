import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerDetailsHeaderComponent } from './player-details-header.component';

describe('PlayerDetailsHeaderComponent', () => {
  let component: PlayerDetailsHeaderComponent;
  let fixture: ComponentFixture<PlayerDetailsHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayerDetailsHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerDetailsHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
