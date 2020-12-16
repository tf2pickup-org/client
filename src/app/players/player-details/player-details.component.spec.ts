/* eslint-disable @typescript-eslint/naming-convention */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PlayerDetailsComponent } from './player-details.component';
import { PlayersService } from '../players.service';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { convertToParamMap, ActivatedRoute } from '@angular/router';
import { loadPlayer } from '../actions';
import { MockComponent } from 'ng-mocks';
import { PlayerDetailsExternalProfileLinksComponent } from
  '../player-details-external-profile-links/player-details-external-profile-links.component';
import { PlayerDetailsBadgesComponent } from '../player-details-badges/player-details-badges.component';
import { PlayerDetailsHeaderComponent } from '../player-details-header/player-details-header.component';
import { PlayerStatsComponent } from '../player-stats/player-stats.component';
import { PlayerDetailsGameListComponent } from '../player-details-game-list/player-details-game-list.component';
import { By } from '@angular/platform-browser';
import { PlayerRole } from '../models/player-role';
import { Player } from '../models/player';
import { MemoizedSelector } from '@ngrx/store';
import { PlayerDetailsAdminButtonsComponent } from '../player-details-admin-buttons/player-details-admin-buttons.component';
import { isAdmin } from '@app/profile/profile.selectors';

const paramMap = of(convertToParamMap({ id: 'FAKE_ID' }));

describe('PlayerDetailsComponent', () => {
  let component: PlayerDetailsComponent;
  let fixture: ComponentFixture<PlayerDetailsComponent>;
  let store: MockStore<any>;
  let storeDispatchSpy: jasmine.Spy;
  let playersService: jasmine.SpyObj<PlayersService>;
  let isAdminSelector: MemoizedSelector<unknown, boolean>;

  const initialState = {
    players: {
      players: {
        ids: [],
        entities: { },
      }
    },
    profile: { },
  };

  beforeEach(() => {
    playersService = jasmine.createSpyObj<PlayersService>(PlayersService.name, ['fetchPlayerStats']);
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        PlayerDetailsComponent,
        MockComponent(PlayerDetailsExternalProfileLinksComponent),
        MockComponent(PlayerDetailsBadgesComponent),
        MockComponent(PlayerDetailsHeaderComponent),
        MockComponent(PlayerStatsComponent),
        MockComponent(PlayerDetailsGameListComponent),
        MockComponent(PlayerDetailsAdminButtonsComponent),
      ],
      imports: [
        RouterTestingModule,
      ],
      providers: [
        { provide: PlayersService, useValue: playersService  },
        provideMockStore({ initialState }),
        { provide: ActivatedRoute, useValue: { paramMap } },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.inject(MockStore);
    isAdminSelector = store.overrideSelector(isAdmin, false);
    storeDispatchSpy = spyOn(store, 'dispatch').and.callThrough();

    fixture = TestBed.createComponent(PlayerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#ngOnInit()', () => {
    it('should load the player', () => {
      expect(storeDispatchSpy).toHaveBeenCalledWith(loadPlayer({ playerId: 'FAKE_ID' }));
    });

    it('should load player\'s stats', () => {
      expect(playersService.fetchPlayerStats).toHaveBeenCalledWith('FAKE_ID');
    });
  });

  describe('when player loaded', () => {
    const player: Player = {
      joinedAt: new Date(),
      steamId: '76561198977546450',
      name: 'niewielki',
      avatar: {
        small: 'FAKE_SMALL_AVATAR_URL',
        medium: 'FAKE_MEDIUM_AVATAR_URL',
        large: 'FAKE_LARGE_AVATAR_URL',
      },
      role: 'admin' as PlayerRole,
      etf2lProfileId: 12345,
      id: 'FAKE_ID',
    };

    const stateWithFakePlayer = {
      ...initialState,
      players: {
        players: {
          ids: [
            'FAKE_ID',
          ],
          entities: {
            FAKE_ID: player,
          },
          locked: false
        },
      },
    };

    beforeEach(() => {
      store.setState(stateWithFakePlayer);
      fixture.detectChanges();
    });

    it('should render external profile links', () => {
      const externalProfileLinksComponent =
        fixture.debugElement.query(By.css('app-player-details-external-profile-links'))
          .componentInstance as PlayerDetailsExternalProfileLinksComponent;

      expect(externalProfileLinksComponent).toBeTruthy();
      expect(externalProfileLinksComponent.player).toEqual(player);
    });

    it('should render player badges', () => {
      const playerBadgesComponent =
        fixture.debugElement.query(By.css('app-player-details-badges')).componentInstance as PlayerDetailsBadgesComponent;

      expect(playerBadgesComponent).toBeTruthy();
      expect(playerBadgesComponent.player).toEqual(player);
    });

    it('should render details header', () => {
      const playerDetailsHeaderComponent =
        fixture.debugElement.query(By.css('app-player-details-header')).componentInstance as PlayerDetailsHeaderComponent;

      expect(playerDetailsHeaderComponent).toBeTruthy();
      expect(playerDetailsHeaderComponent.player).toEqual(player);
    });

    it('should render the player\'s game list', () => {
      const gameListComponent =
        fixture.debugElement.query(By.css('app-player-details-game-list')).componentInstance as PlayerDetailsGameListComponent;

      expect(gameListComponent).toBeTruthy();
      expect(gameListComponent.playerId).toEqual('FAKE_ID');
    });

    describe('when logged-in as an admin', () => {
      beforeEach(() => {
        isAdminSelector.setResult(true);
        store.refreshState();
        fixture.detectChanges();
      });

      it('should render admin buttons', () => {
        const playerDetailsAdminButtonsComponent =
          fixture.debugElement.query(By.css('app-player-details-admin-buttons')).componentInstance as PlayerDetailsAdminButtonsComponent;

        expect(playerDetailsAdminButtonsComponent).toBeTruthy();
        expect(playerDetailsAdminButtonsComponent.playerId).toEqual('FAKE_ID');
      });
    });
  });
});
