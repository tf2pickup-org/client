import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GameTeamHeaderComponent } from './game-team-header.component';
import { By } from '@angular/platform-browser';
import { ChangeDetectionStrategy } from '@angular/core';

describe('GameTeamHeaderComponent', () => {
  let component: GameTeamHeaderComponent;
  let fixture: ComponentFixture<GameTeamHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameTeamHeaderComponent ]
    })
    // https://github.com/angular/angular/issues/12313
    .overrideComponent(GameTeamHeaderComponent, { set: { changeDetection: ChangeDetectionStrategy.Default } })
    .compileComponents();
  }));

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
      header = fixture.debugElement.query(By.css('div.team-header')).nativeElement as HTMLDivElement;
    });

    it('should apply the team-header-red css class', () => {
      expect(header.classList.contains('team-header-red')).toBe(true);
    });

    it('should say RED', () => {
      expect(header.innerText).toEqual('RED');
    });
  });

  describe('when BLU', () => {
    let header: HTMLDivElement;

    beforeEach(() => {
      component.team = 'blu';
      fixture.detectChanges();
      header = fixture.debugElement.query(By.css('div.team-header')).nativeElement as HTMLDivElement;
    });

    it('should apply the team-header-blu css class', () => {
      expect(header.classList.contains('team-header-blu')).toBe(true);
    });

    it('should say BLU', () => {
      expect(header.innerText).toEqual('BLU');
    });

    describe('with score', () => {
      beforeEach(() => {
        component.score = 5;
        fixture.detectChanges();
      });

      it('should render the score', () => {
        const badge = fixture.debugElement.query(By.css('.team-score')).nativeElement as HTMLElement;
        expect(badge.innerText).toEqual('5');
        expect(badge.classList.contains('badge')).toBe(true);
      });
    });
  });
});
