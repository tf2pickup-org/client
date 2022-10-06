import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameServerOptionListDialogComponent } from './game-server-option-list-dialog.component';

describe('GameServerOptionListDialogComponent', () => {
  let component: GameServerOptionListDialogComponent;
  let fixture: ComponentFixture<GameServerOptionListDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameServerOptionListDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameServerOptionListDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
