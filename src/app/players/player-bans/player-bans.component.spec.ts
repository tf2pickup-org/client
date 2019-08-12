import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerBansComponent } from './player-bans.component';

describe('PlayerBansComponent', () => {
  let component: PlayerBansComponent;
  let fixture: ComponentFixture<PlayerBansComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayerBansComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerBansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
