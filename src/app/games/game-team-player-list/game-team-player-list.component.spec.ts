import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { GameTeamPlayerListComponent } from './game-team-player-list.component';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA, ChangeDetectionStrategy } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('GameTeamPlayerListComponent', () => {
  let component: GameTeamPlayerListComponent;
  let fixture: ComponentFixture<GameTeamPlayerListComponent>;

  beforeEach(waitForAsync(() => {
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
        { id: 'PLAYER_ID', name: 'FAKE_PLAYER', joinedAt: new Date(), steamId: 'FAKE_STEAM_ID', avatarUrl: 'FAKE_AVATAR_URL',
          player: 'FAKE_PLAYER_ID', team: 'blu', gameClass: 'scout', connectionStatus: 'offline', status: 'active' },
      ];
      fixture.detectChanges();
    });

    it('should not render admin buttons', () => {
      expect(fixture.debugElement.query(By.css('div>a>button'))).toBeNull();
    });

    describe('when admin', () => {
      beforeEach(() => {
        component.showAdminActionButtons = true;
        fixture.detectChanges();
      });

      it('should render admin buttons', () => {
        expect(fixture.debugElement.query(By.css('.btn-request-substitute'))).toBeDefined();
      });

      it('should trigger the requestSubstitute event', done => {
        const button = fixture.debugElement.query(By.css('.btn-request-substitute')).nativeElement as HTMLButtonElement;
        component.requestSubstitute.subscribe((playerId: string) => {
          expect(playerId).toEqual('PLAYER_ID');
          done();
        });
        button.click();
      });
    });

    describe('when looking for substitute', () => {
      beforeEach(() => {
        component.players[0].status = 'waiting for substitute';
        fixture.detectChanges();
      });

      it('should apply css class for players that are looking for substitutes', () => {
        const item = fixture.debugElement.query(By.css('.player-item.looking-for-substitute')).nativeElement as HTMLElement;
        expect(item).toBeDefined();
        expect(item.classList.contains('list-group-item-warning')).toBe(true);
      });

      it('should trigger the replacePlayer event', done => {
        const button = fixture.debugElement.query(By.css('.player-item.looking-for-substitute')).nativeElement as HTMLButtonElement;
        component.replacePlayer.subscribe((playerId: string) => {
          expect(playerId).toEqual('PLAYER_ID');
          done();
        });
        button.click();
      });

      it('should be disabled if the locked=true', () => {
        const button = fixture.debugElement.query(By.css('.player-item.looking-for-substitute')).nativeElement as HTMLButtonElement;
        expect(button.disabled).toBe(false);

        component.locked = true;
        fixture.detectChanges();
        expect(button.disabled).toBe(true);
      });
    });
  });
});
