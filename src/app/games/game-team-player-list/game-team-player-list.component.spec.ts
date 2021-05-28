import { GameTeamPlayerListComponent } from './game-team-player-list.component';
import {
  MockBuilder,
  MockedComponentFixture,
  MockRender,
  ngMocks,
} from 'ng-mocks';
import { PlayerConnectionStatusComponent } from '../player-connection-status/player-connection-status.component';
import { ResolvedGameSlot } from '../models/resolved-game-slot';
import { OrderTf2ClassesPipe } from '../order-tf2-classes.pipe';
import { Subject } from 'rxjs';

describe('GameTeamPlayerListComponent', () => {
  let component: GameTeamPlayerListComponent;
  let fixture: MockedComponentFixture;
  let inputs: {
    players: Subject<ResolvedGameSlot[]>;
    showPlayerConnectionStatus: Subject<boolean>;
    showAdminActionButtons: Subject<boolean>;
    locked: Subject<boolean>;
  };

  beforeEach(() => {
    inputs = {
      players: new Subject(),
      showPlayerConnectionStatus: new Subject(),
      showAdminActionButtons: new Subject(),
      locked: new Subject(),
    };
  });

  beforeEach(() =>
    MockBuilder(GameTeamPlayerListComponent)
      .mock(PlayerConnectionStatusComponent)
      .mock(OrderTf2ClassesPipe, value => value),
  );

  beforeEach(() => {
    fixture = MockRender(
      `
      <app-game-team-player-list
        [players]="players | async"
        [showPlayerConnectionStatus]="showPlayerConnectionStatus | async"
        [showAdminActionButtons]="showAdminActionButtons | async"
        [locked]="locked | async"
      ></app-game-team-player-list>
    `,
      {
        players: inputs.players.asObservable(),
        showPlayerConnectionStatus:
          inputs.showPlayerConnectionStatus.asObservable(),
        showAdminActionButtons: inputs.showAdminActionButtons.asObservable(),
        locked: inputs.locked.asObservable(),
      },
    );
    component = fixture.point.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('with players', () => {
    const mockPlayer: ResolvedGameSlot = {
      id: 'PLAYER_ID',
      name: 'FAKE_PLAYER',
      joinedAt: new Date(),
      steamId: 'FAKE_STEAM_ID',
      roles: [],
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
      _links: [],
    };

    beforeEach(() => {
      inputs.players.next([mockPlayer]);
      fixture.detectChanges();
    });

    it('should not render admin buttons', () => {
      expect(() => ngMocks.find('.request-substitute-buton')).toThrow();
    });

    describe('when rendering connection status', () => {
      beforeEach(() => {
        inputs.showPlayerConnectionStatus.next(true);
        fixture.detectChanges();
      });

      describe('when the player is offline', () => {
        it('should render connection status', () => {
          const connectionStatus = ngMocks.findInstance(
            PlayerConnectionStatusComponent,
          );
          expect(connectionStatus.connectionStatus).toEqual('offline');
        });
      });

      describe('when the player is joining', () => {
        beforeEach(() => {
          inputs.players.next([{ ...mockPlayer, connectionStatus: 'joining' }]);
          fixture.detectChanges();
        });

        it('should render connection status', () => {
          const connectionStatus = ngMocks.findInstance(
            PlayerConnectionStatusComponent,
          );
          expect(connectionStatus.connectionStatus).toEqual('joining');
        });
      });

      describe('when the player is connected', () => {
        beforeEach(() => {
          inputs.players.next([
            { ...mockPlayer, connectionStatus: 'connected' },
          ]);
          fixture.detectChanges();
        });

        it('should render connection status', () => {
          const connectionStatus = ngMocks.findInstance(
            PlayerConnectionStatusComponent,
          );
          expect(connectionStatus.connectionStatus).toEqual('connected');
        });
      });
    });

    describe('when admin', () => {
      beforeEach(() => {
        inputs.showAdminActionButtons.next(true);
        fixture.detectChanges();
      });

      it('should render admin buttons', () => {
        expect(ngMocks.find('.request-substitute-button')).toBeDefined();
      });

      it('should trigger the requestSubstitute event', done => {
        const button = ngMocks.find('.request-substitute-button')
          .nativeElement as HTMLButtonElement;
        component.requestSubstitute.subscribe((playerId: string) => {
          expect(playerId).toEqual('PLAYER_ID');
          done();
        });
        button.click();
      });
    });

    describe('when looking for substitute', () => {
      beforeEach(() => {
        inputs.players.next([
          { ...mockPlayer, status: 'waiting for substitute' },
        ]);
        fixture.detectChanges();
      });

      it('should apply css class for players that are looking for substitutes', () => {
        expect(
          ngMocks.find('.replace-player-button').nativeElement,
        ).toBeDefined();
      });

      it('should trigger the replacePlayer event', done => {
        const button = ngMocks.find('.replace-player-button')
          .nativeElement as HTMLButtonElement;
        component.replacePlayer.subscribe((playerId: string) => {
          expect(playerId).toEqual('PLAYER_ID');
          done();
        });
        button.click();
      });

      it('should be disabled if locked=true', () => {
        const button = ngMocks.find('.replace-player-button')
          .nativeElement as HTMLButtonElement;
        expect(button.disabled).toBe(false);

        inputs.locked.next(true);
        fixture.detectChanges();
        expect(button.disabled).toBe(true);
      });
    });

    describe('when skill is defined', () => {
      beforeEach(() => {
        inputs.players.next([{ ...mockPlayer, classSkill: 0 }]);
        fixture.detectChanges();
      });

      it('should render skill', () => {
        const span = ngMocks.find('.player-list-item__skill')
          .nativeElement as HTMLElement;
        expect(span.innerText).toEqual('0');
      });
    });
  });
});
