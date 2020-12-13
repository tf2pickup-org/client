import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { QueueAlertsComponent } from './queue-alerts.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Store, MemoizedSelector } from '@ngrx/store';
import { By } from '@angular/platform-browser';
import { AppState } from '@app/app.state';
import { Game } from '@app/games/models/game';
import { activeGame } from '@app/games/games.selectors';
import { PlayerBan } from '@app/players/models/player-ban';
import { bans } from '@app/profile/profile.selectors';
import { SubstituteRequest } from '../models/substitute-request';
import { substituteRequests } from '../queue.selectors';
import { MockComponent } from 'ng-mocks';
import { ActiveGameSnackbarComponent } from '../active-game-snackbar/active-game-snackbar.component';
import { SubstituteRequestBannerComponent } from '../substitute-request-banner/substitute-request-banner.component';

describe('QueueAlertsComponent', () => {
  let component: QueueAlertsComponent;
  let fixture: ComponentFixture<QueueAlertsComponent>;
  let store: MockStore<any>;
  let activeGameSelector: MemoizedSelector<AppState, Game>;
  let bansSelector: MemoizedSelector<AppState, PlayerBan[]>;
  let substituteRequestsSelector: MemoizedSelector<AppState, SubstituteRequest[]>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        QueueAlertsComponent,
        MockComponent(ActiveGameSnackbarComponent),
        MockComponent(SubstituteRequestBannerComponent),
      ],
      imports: [
        RouterTestingModule,
      ],
      providers: [
        provideMockStore(),
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.inject(MockStore);
    activeGameSelector = store.overrideSelector(activeGame, null);
    bansSelector = store.overrideSelector(bans, []);
    substituteRequestsSelector = store.overrideSelector(substituteRequests, []);

    fixture = TestBed.createComponent(QueueAlertsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('with ban issued', () => {
    beforeEach(() => {
      bansSelector.setResult([
        {
          id: 'FAKE_BAN_ID',
          player: 'FAKE_PLAYER_ID',
          reason: 'FAKE_REASON',
          start: new Date(),
          end: new Date(),
          admin: 'FAKE_ADMIN_ID',
        },
      ]);
      store.refreshState();
      fixture.detectChanges();
    });

    it('should show alert', () => {
      const el = fixture.debugElement.query(By.css('div.alert.alert-danger')).nativeElement as HTMLDivElement;
      expect(el).toBeTruthy();
    });
  });

  describe('with active game', () => {
    const mockGame: Game = {
      id: 'FAKE_GAME_ID',
      // eslint-disable-next-line id-blacklist
      number: 234,
      launchedAt: new Date(),
      map: 'cp_badlands',
    } as any;

    beforeEach(() => {
      activeGameSelector.setResult(mockGame);
      store.refreshState();
      fixture.detectChanges();
    });

    it('should show the snackbar', () => {
      const activeGameSnackbar = fixture.debugElement.query(By.css('app-active-game-snackbar'))
        .componentInstance as ActiveGameSnackbarComponent;
      expect(activeGameSnackbar).toBeTruthy();
      expect(activeGameSnackbar.game).toEqual(mockGame);
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
      substituteRequestsSelector.setResult([ mockSubstituteRequest ]);
      store.refreshState();
      fixture.detectChanges();
    });

    it('should render the subsitute alert banner', () => {
      const substituteRequestBanner = fixture.debugElement.query(By.css('app-substitute-request-banner'))
        .componentInstance as SubstituteRequestBannerComponent;
      expect(substituteRequestBanner).toBeTruthy();
      expect(substituteRequestBanner.substituteRequest).toEqual(mockSubstituteRequest);
    });
  });
});
