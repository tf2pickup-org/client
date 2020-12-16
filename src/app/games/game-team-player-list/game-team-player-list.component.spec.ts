import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { GameTeamPlayerListComponent } from './game-team-player-list.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ChangeDetectionStrategy } from '@angular/core';
import { By } from '@angular/platform-browser';
import { MockComponent } from 'ng-mocks';
import { PlayerConnectionStatusComponent } from '../player-connection-status/player-connection-status.component';
import { ResolvedGamePlayer } from '../models/resolved-game-player';

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
        MockComponent(PlayerConnectionStatusComponent),
      ],
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
    const mockPlayer: ResolvedGamePlayer = {
      id: 'PLAYER_ID',
      name: 'FAKE_PLAYER',
      joinedAt: new Date(),
      steamId: 'FAKE_STEAM_ID',
      avatar: {
        small: 'FAKE_SMALL_AVATAR_URL',
        medium: 'FAKE_MEDIUM_AVATAR_URL',
        large: 'FAKE_LARGE_AVATAR_URL',
      },
      player: 'FAKE_PLAYER_ID',
      team: 'blu',
      gameClass: 'scout',
      connectionStatus: 'offline',
      status: 'active',
    };

    beforeEach(() => {
      component.players = [ { ...mockPlayer } ];
      fixture.detectChanges();
    });

    it('should not render admin buttons', () => {
      expect(fixture.debugElement.query(By.css('.request-substitute-button'))).toBeNull();
    });

    describe('when rendering connection status', () => {
      beforeEach(() => {
        component.showPlayerConnectionStatus = true;
        fixture.detectChanges();
      });

      describe('when the player is offline', () => {
        it('should render connection status', () => {
          const connectionStatus = fixture.debugElement.query(By.css('app-player-connection-status'))
            .componentInstance as PlayerConnectionStatusComponent;
          expect(connectionStatus.connectionStatus).toEqual('offline');
        });
      });

      describe('when the player is joining', () => {
        beforeEach(() => {
          component.players = [ { ...mockPlayer, connectionStatus: 'joining' } ];
          fixture.detectChanges();
        });

        it('should render connection status', () => {
          const connectionStatus = fixture.debugElement.query(By.css('app-player-connection-status'))
            .componentInstance as PlayerConnectionStatusComponent;
          expect(connectionStatus.connectionStatus).toEqual('joining');
        });
      });

      describe('when the player is connected', () => {
        beforeEach(() => {
          component.players = [ { ...mockPlayer, connectionStatus: 'connected' } ];
          fixture.detectChanges();
        });

        it('should render connection status', () => {
          const connectionStatus = fixture.debugElement.query(By.css('app-player-connection-status'))
            .componentInstance as PlayerConnectionStatusComponent;
          expect(connectionStatus.connectionStatus).toEqual('connected');
        });
      });
    });

    describe('when admin', () => {
      beforeEach(() => {
        component.showAdminActionButtons = true;
        fixture.detectChanges();
      });

      it('should render admin buttons', () => {
        expect(fixture.debugElement.query(By.css('.request-substitute-button'))).toBeDefined();
      });

      it('should trigger the requestSubstitute event', done => {
        const button = fixture.debugElement.query(By.css('.request-substitute-button')).nativeElement as HTMLButtonElement;
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
        const item = fixture.debugElement.query(By.css('.replace-player-button')).nativeElement as HTMLElement;
        expect(item).toBeDefined();
      });

      it('should trigger the replacePlayer event', done => {
        const button = fixture.debugElement.query(By.css('.replace-player-button')).nativeElement as HTMLButtonElement;
        component.replacePlayer.subscribe((playerId: string) => {
          expect(playerId).toEqual('PLAYER_ID');
          done();
        });
        button.click();
      });

      it('should be disabled if locked=true', () => {
        const button = fixture.debugElement.query(By.css('.replace-player-button')).nativeElement as HTMLButtonElement;
        expect(button.disabled).toBe(false);

        component.locked = true;
        fixture.detectChanges();
        expect(button.disabled).toBe(true);
      });
    });
  });
});
