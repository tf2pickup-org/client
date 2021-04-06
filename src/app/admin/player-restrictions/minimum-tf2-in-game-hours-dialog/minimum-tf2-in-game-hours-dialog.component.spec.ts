import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinimumTf2InGameHoursDialogComponent } from './minimum-tf2-in-game-hours-dialog.component';

describe('MinimumTf2InGameHoursDialogComponent', () => {
  let component: MinimumTf2InGameHoursDialogComponent;
  let fixture: ComponentFixture<MinimumTf2InGameHoursDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MinimumTf2InGameHoursDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MinimumTf2InGameHoursDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
