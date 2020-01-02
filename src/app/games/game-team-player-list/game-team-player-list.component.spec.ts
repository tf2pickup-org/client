import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GameTeamPlayerListComponent } from './game-team-player-list.component';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA, ChangeDetectionStrategy } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('GameTeamPlayerListComponent', () => {
  let component: GameTeamPlayerListComponent;
  let fixture: ComponentFixture<GameTeamPlayerListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
      ],
      declarations: [
        GameTeamPlayerListComponent,
      ],
      schemas: [ NO_ERRORS_SCHEMA ],
    })
    // https://github.com/angular/angular/issues/12313
    .overrideComponent(GameTeamPlayerListComponent, { set: { changeDetection: ChangeDetectionStrategy.Default } })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameTeamPlayerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('with players', () => {
    beforeEach(() => {
      component.players = [
        { id: 'PLAYER_ID', name: 'FAKE_PLAYER', joinedAt: new Date(), steamId: 'FAKE_STEAM_ID', avatarUrl: 'FAKE_AVATAR_URL', gameCount: 0,
          playerId: 'FAKE_PLAYER_ID', teamId: '1', gameClass: 'scout', connectionStatus: 'offline' },
      ];
      fixture.detectChanges();
    });

    it('should apply correct css classes for red and blu', () => {
      const div = fixture.debugElement.query(By.css('.team-header')).nativeElement as HTMLDivElement;
      expect(div).toBeDefined();

      component.team = 'blu';
      fixture.detectChanges();
      expect(div.classList.contains('team-header-blu')).toBeTrue();
      expect(div.innerText).toEqual('BLU');

      component.team = 'red';
      fixture.detectChanges();
      expect(div.classList.contains('team-header-red')).toBeTrue();
      expect(div.innerText).toEqual('RED');
    });
  });
});
