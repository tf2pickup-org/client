import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { QueueAlertsComponent } from './queue-alerts.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Store } from '@ngrx/store';
import { By } from '@angular/platform-browser';

describe('QueueAlertsComponent', () => {
  let component: QueueAlertsComponent;
  let fixture: ComponentFixture<QueueAlertsComponent>;
  let store: MockStore<any>;

  const initialState = {
    profile: {
      profile: {
        id: 'FAKE_PLAYER_ID',
        bans: []
      }
    },
    games: {
      ids: [],
      entities: {},
    },
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QueueAlertsComponent ],
      imports: [
        RouterTestingModule,
      ],
      providers: [
        provideMockStore({ initialState }),
      ],
      schemas: [ NO_ERRORS_SCHEMA ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.get(Store);
    fixture = TestBed.createComponent(QueueAlertsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('with ban issued', () => {
    beforeEach(() => {
      store.setState({
        ...initialState,
        profile: {
          profile: {
            id: 'FAKE_PLAYER_ID',
            bans: [
              { id: 'FAKE_BAN_ID', player: 'FAKE_PLAYER_ID', reason: 'FAKE_REASON', end: new Date() },
            ],
          },
        },
      });
      fixture.detectChanges();
    });

    it('should show alert', () => {
      const el = fixture.debugElement.query(By.css('div.alert.alert-danger')).nativeElement as HTMLDivElement;
      expect(el).toBeTruthy();
    });
  });

  describe('with active game', () => {
    beforeEach(() => {
      store.setState({
        ...initialState,
        games: {
          ids: [
            'FAKE_GAME_ID'
          ],
          entities: {
            FAKE_GAME_ID: {
              players: [
                'FAKE_PLAYER_ID',
                'FAKE_PLAYER_2_ID'
              ],
              id: 'FAKE_GAME_ID',
              state: 'started',
            }
          },
        },
      });
      fixture.detectChanges();
    });

    it('should show alert', () => {
      const el = fixture.debugElement.query(By.css('div.alert.alert-primary')).nativeElement as HTMLDivElement;
      expect(el).toBeTruthy();
    });
  });
});
