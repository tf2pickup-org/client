import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PlayerDetailsBadgesComponent } from './player-details-badges.component';
import { By } from '@angular/platform-browser';
import { Player } from '../models/player';
import { ChangeDetectionStrategy } from '@angular/core';

describe('PlayerDetailsBadgesComponent', () => {
  let component: PlayerDetailsBadgesComponent;
  let fixture: ComponentFixture<PlayerDetailsBadgesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayerDetailsBadgesComponent ]
    })
    // https://github.com/angular/angular/issues/12313
    .overrideComponent(PlayerDetailsBadgesComponent, { set: { changeDetection: ChangeDetectionStrategy.Default } })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerDetailsBadgesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not render any badges', () => {
    expect(fixture.debugElement.query(By.css('.badge'))).toBe(null);
  });

  describe('with player', () => {
    describe('that is an admin', () => {
      beforeEach(() => {
        component.player = {
          role: 'admin',
        } as Player;

        fixture.detectChanges();
      });

      it('should render admin badge', () => {
        expect(fixture.debugElement.query(By.css('.badge--admin'))).toBeTruthy();
      });
    });

    describe('that is not an admin', () => {
      beforeEach(() => {
        component.player = { } as Player;
        fixture.detectChanges();
      });

      it('should not render admin badge', () => {
        expect(fixture.debugElement.query(By.css('.badge--admin'))).toBeNull();
      });
    });
  });
});
