import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PlayerStatsComponent } from './player-stats.component';
import { By } from '@angular/platform-browser';
import { ChangeDetectionStrategy } from '@angular/core';
import { MockComponent } from 'ng-mocks';
import { GameClassIconComponent } from '@app/shared/game-class-icon/game-class-icon.component';

describe('PlayerStatsComponent', () => {
  let component: PlayerStatsComponent;
  let fixture: ComponentFixture<PlayerStatsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        PlayerStatsComponent,
        MockComponent(GameClassIconComponent),
      ],
    })
      // https://github.com/angular/angular/issues/12313
      .overrideComponent(PlayerStatsComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
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

  it('should render ghost', () => {
    expect(
      fixture.debugElement.query(By.css('.games-player-total .ghost')),
    ).toBeDefined();
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

    it('should render all class icons', () => {
      const classIcons = fixture.debugElement
        .queryAll(By.css('app-game-class-icon'))
        .map(i => i.componentInstance as GameClassIconComponent);
      expect(classIcons.length).toBe(4);
    });
  });
});
