import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { QueueAlertsComponent } from './queue-alerts.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Store, MemoizedSelector } from '@ngrx/store';
import { By } from '@angular/platform-browser';
import { AppState } from '@app/app.state';
import { Game } from '@app/games/models/game';
import { activeGame } from '@app/games/games.selectors';
import { PlayerBan } from '@app/players/models/player-ban';
import { bans } from '@app/profile/profile.selectors';
import { SubstituteRequest } from '../models/substitute-request';
import { substituteRequests } from '../queue.selectors';

describe('QueueAlertsComponent', () => {
  let component: QueueAlertsComponent;
  let fixture: ComponentFixture<QueueAlertsComponent>;
  let store: MockStore<any>;
  let activeGameSelector: MemoizedSelector<AppState, Game>;
  let bansSelector: MemoizedSelector<AppState, PlayerBan[]>;
  let substituteRequestsSelector: MemoizedSelector<AppState, SubstituteRequest[]>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ QueueAlertsComponent ],
      imports: [
        RouterTestingModule,
      ],
      providers: [
        provideMockStore(),
      ],
      schemas: [ NO_ERRORS_SCHEMA ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.get(Store);
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
    beforeEach(() => {
      activeGameSelector.setResult({
        id: 'FAKE_GAME_ID',
        // eslint-disable-next-line id-blacklist
        number: 234,
        launchedAt: new Date(),
        map: 'cp_badlands',
      } as any);
      store.refreshState();
      fixture.detectChanges();
    });

    it('should show alert', () => {
      const el = fixture.debugElement.query(By.css('div.alert.alert-primary')).nativeElement as HTMLDivElement;
      expect(el).toBeTruthy();
    });
  });

  describe('with player substitute announcement', () => {
    beforeEach(() => {
      substituteRequestsSelector.setResult([
        {
          gameId: '5e1fb93d9cacb6d6e08bc6bf',
          gameNumber: 514,
          gameClass: 'soldier',
          team: 'BLU',
        },
      ]);
      store.refreshState();
      fixture.detectChanges();
    });

    it('should render the subsitute alert', () => {
      const el = fixture.debugElement.query(By.css('div.alert.alert-warning')).nativeElement as HTMLDivElement;
      expect(el).toBeTruthy();
    });
  });
});
