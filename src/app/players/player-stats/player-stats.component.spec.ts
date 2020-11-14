import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PlayerStatsComponent } from './player-stats.component';
import { By } from '@angular/platform-browser';
import { ChangeDetectionStrategy } from '@angular/core';

describe('PlayerStatsComponent', () => {
  let component: PlayerStatsComponent;
  let fixture: ComponentFixture<PlayerStatsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayerStatsComponent ],
    })
    // https://github.com/angular/angular/issues/12313
    .overrideComponent(PlayerStatsComponent, { set: { changeDetection: ChangeDetectionStrategy.Default } })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('for 6v6 stats', () => {
    beforeEach(() => {
      component.playerStats = {
        player: 'FAKE_PLAYER_ID',
        gamesPlayed: 40,
        classesPlayed: {
          scout: 10,
          soldier: 10,
          demoman: 10,
          medic: 10,
        },
      };

      fixture.detectChanges();
    });

    it('should render wide columns', () => {
      const div = fixture.debugElement.query(By.css('.col')).nativeElement as HTMLDivElement;
      expect(div.classList.contains('narrow')).toBe(false);
    });
  });

  describe('for 9v9 stats', () => {
    beforeEach(() => {
      component.playerStats = {
        player: 'FAKE_PLAYER_ID',
        gamesPlayed: 40,
        classesPlayed: {
          scout: 10,
          soldier: 10,
          pyro: 10,
          demoman: 10,
          heavy: 10,
          engineer: 10,
          medic: 10,
          sniper: 10,
          spy: 10,
        },
      };

      fixture.detectChanges();
    });

    it('should render narrow columns', () => {
      const div = fixture.debugElement.query(By.css('.col')).nativeElement as HTMLDivElement;
      expect(div.classList.contains('narrow')).toBe(true);
    });
  });
});
