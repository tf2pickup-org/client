import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { GameTeamHeaderComponent } from './game-team-header.component';
import { By } from '@angular/platform-browser';
import { ChangeDetectionStrategy } from '@angular/core';

describe('GameTeamHeaderComponent', () => {
  let component: GameTeamHeaderComponent;
  let fixture: ComponentFixture<GameTeamHeaderComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [GameTeamHeaderComponent],
      })
        // https://github.com/angular/angular/issues/12313
        .overrideComponent(GameTeamHeaderComponent, {
          set: { changeDetection: ChangeDetectionStrategy.Default },
        })
        .compileComponents();
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(GameTeamHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when RED', () => {
    let header: HTMLDivElement;

    beforeEach(() => {
      component.team = 'red';
      fixture.detectChanges();
      header = fixture.debugElement.query(By.css('.team-header'))
        .nativeElement as HTMLDivElement;
    });

    it('should apply the css class', () => {
      expect(header.classList.contains('team-header--red')).toBe(true);
    });

    it('should say RED', () => {
      expect(header.innerText).toEqual('RED');
    });

    describe('with score', () => {
      beforeEach(() => {
        component.score = 5;
        fixture.detectChanges();
      });

      it('should render the score', () => {
        const score = fixture.debugElement.query(By.css('.team-header__score'))
          .nativeElement as HTMLDivElement;
        expect(score).toBeTruthy();
        expect(score.innerHTML).toEqual('5');
      });
    });
  });

  describe('when BLU', () => {
    let header: HTMLDivElement;

    beforeEach(() => {
      component.team = 'blu';
      fixture.detectChanges();
      header = fixture.debugElement.query(By.css('.team-header'))
        .nativeElement as HTMLDivElement;
    });

    it('should apply the css class', () => {
      expect(header.classList.contains('team-header--blu')).toBe(true);
    });

    it('should say BLU', () => {
      expect(header.innerText).toEqual('BLU');
    });
  });
});
