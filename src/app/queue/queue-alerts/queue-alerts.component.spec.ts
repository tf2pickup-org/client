import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { QueueAlertsComponent } from './queue-alerts.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MemoizedSelector } from '@ngrx/store';
import { By } from '@angular/platform-browser';
import { AppState } from '@app/app.state';
import { PlayerBan } from '@app/players/models/player-ban';
import {
  activeGameId,
  bans,
  restrictions,
} from '@app/profile/profile.selectors';
import { SubstituteRequest } from '../models/substitute-request';
import { substituteRequests } from '../queue.selectors';
import { MockComponent } from 'ng-mocks';
import { ActiveGameSnackbarComponent } from '../active-game-snackbar/active-game-snackbar.component';
import { SubstituteRequestBannerComponent } from '../substitute-request-banner/substitute-request-banner.component';
import { BanBannerComponent } from '../ban-banner/ban-banner.component';
import { RestrictionBannerComponent } from '../restriction-banner/restriction-banner.component';

describe('QueueAlertsComponent', () => {
  let component: QueueAlertsComponent;
  let fixture: ComponentFixture<QueueAlertsComponent>;
  let store: MockStore;
  let activeGameIdSelector: MemoizedSelector<AppState, string>;
  let bansSelector: MemoizedSelector<AppState, PlayerBan[]>;
  let substituteRequestsSelector: MemoizedSelector<
    AppState,
    SubstituteRequest[]
  >;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        QueueAlertsComponent,
        MockComponent(ActiveGameSnackbarComponent),
        MockComponent(SubstituteRequestBannerComponent),
        MockComponent(BanBannerComponent),
        MockComponent(RestrictionBannerComponent),
      ],
      imports: [RouterTestingModule],
      providers: [provideMockStore()],
    }).compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.inject(MockStore);
    activeGameIdSelector = store.overrideSelector(activeGameId, null);
    bansSelector = store.overrideSelector(bans, []);
    substituteRequestsSelector = store.overrideSelector(substituteRequests, []);
    store.overrideSelector(restrictions, []);

    fixture = TestBed.createComponent(QueueAlertsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => TestBed.inject(MockStore)?.resetSelectors());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('with ban issued', () => {
    const mockBan: PlayerBan = {
      id: 'FAKE_BAN_ID',
      player: 'FAKE_PLAYER_ID',
      reason: 'FAKE_REASON',
      start: new Date(),
      end: new Date(),
      admin: 'FAKE_ADMIN_ID',
    };

    beforeEach(() => {
      bansSelector.setResult([mockBan]);
      store.refreshState();
      fixture.detectChanges();
    });

    it('should show alert', () => {
      const banBanner = fixture.debugElement.query(By.css('app-ban-banner'))
        .componentInstance as BanBannerComponent;
      expect(banBanner).toBeTruthy();
      expect(banBanner.ban).toEqual(mockBan);
    });
  });

  describe('with active game', () => {
    const gameId = 'FAKE_GAME_ID';

    beforeEach(() => {
      activeGameIdSelector.setResult(gameId);
      store.refreshState();
      fixture.detectChanges();
    });

    it('should show the snackbar', () => {
      const activeGameSnackbar = fixture.debugElement.query(
        By.css('app-active-game-snackbar'),
      ).componentInstance as ActiveGameSnackbarComponent;
      expect(activeGameSnackbar).toBeTruthy();
      expect(activeGameSnackbar.gameId).toEqual(gameId);
    });
  });

  describe('with player substitute announcement', () => {
    const mockSubstituteRequest: SubstituteRequest = {
      gameId: '5e1fb93d9cacb6d6e08bc6bf',
      gameNumber: 514,
      gameClass: 'soldier',
      team: 'BLU',
    };

    beforeEach(() => {
      substituteRequestsSelector.setResult([mockSubstituteRequest]);
      store.refreshState();
      fixture.detectChanges();
    });

    it('should render the substitute alert banner', () => {
      const substituteRequestBanner = fixture.debugElement.query(
        By.css('app-substitute-request-banner'),
      ).componentInstance as SubstituteRequestBannerComponent;
      expect(substituteRequestBanner).toBeTruthy();
      expect(substituteRequestBanner.substituteRequest).toEqual(
        mockSubstituteRequest,
      );
    });
  });
});
