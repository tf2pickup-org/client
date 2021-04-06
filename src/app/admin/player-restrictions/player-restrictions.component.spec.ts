import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerRestrictionsComponent } from './player-restrictions.component';

describe('PlayerRestrictionsComponent', () => {
  let component: PlayerRestrictionsComponent;
  let fixture: ComponentFixture<PlayerRestrictionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayerRestrictionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerRestrictionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
