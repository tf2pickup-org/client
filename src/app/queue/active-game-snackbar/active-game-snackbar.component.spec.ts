import { ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { ActiveGameSnackbarComponent } from './active-game-snackbar.component';

describe('ActiveGameSnackbarComponent', () => {
  let component: ActiveGameSnackbarComponent;
  let fixture: ComponentFixture<ActiveGameSnackbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ActiveGameSnackbarComponent],
      imports: [RouterTestingModule],
    })
      // https://github.com/angular/angular/issues/12313
      .overrideComponent(ActiveGameSnackbarComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveGameSnackbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('with game', () => {
    beforeEach(() => {
      component.gameId = 'FAKE_GAME_ID';
      fixture.detectChanges();
    });

    it('should redirect user to the game', () => {
      const anchor = fixture.debugElement.query(By.css('a'))
        .nativeElement as HTMLAnchorElement;
      expect(anchor).toBeTruthy();
      expect(anchor.href).toMatch(/\/game\/FAKE_GAME_ID$/);
    });
  });
});
