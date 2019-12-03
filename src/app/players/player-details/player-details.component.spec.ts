import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PlayerDetailsComponent } from './player-details.component';
import { PlayersService } from '../players.service';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { convertToParamMap, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { loadPlayer } from '../actions';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Etf2lProfileLinkPipe } from '../etf2l-profile-link.pipe';
import { LogsTfProfileLinkPipe } from '../logs-tf-profile-link.pipe';
import { SteamProfileLinkPipe } from '../steam-profile-link.pipe';

class PlayersServiceStub {
  fetchPlayerStats() { return of({}); }
}

const paramMap = of(convertToParamMap({ id: 'FAKE_ID' }));

describe('PlayerDetailsComponent', () => {
  let component: PlayerDetailsComponent;
  let fixture: ComponentFixture<PlayerDetailsComponent>;
  let store: MockStore<any>;
  let storeDispatchSpy: jasmine.Spy;
  let fetchPlayerStatsSpy: jasmine.Spy;

  const initialState = {
    players: {
      players: {
        ids: [],
        entities: { },
      }
    },
    profile: { profile: { } },
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        Etf2lProfileLinkPipe,
        LogsTfProfileLinkPipe,
        SteamProfileLinkPipe,
        PlayerDetailsComponent,
      ],
      imports: [
        RouterTestingModule,
      ],
      providers: [
        { provide: PlayersService, useClass: PlayersServiceStub  },
        provideMockStore({ initialState }),
        { provide: ActivatedRoute, useValue: { paramMap } },
      ],
      schemas: [ NO_ERRORS_SCHEMA ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.get(Store);
    storeDispatchSpy = spyOn(store, 'dispatch').and.callThrough();
    fetchPlayerStatsSpy = spyOn(TestBed.get(PlayersService), 'fetchPlayerStats').and.callThrough();

    fixture = TestBed.createComponent(PlayerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#ngOnInit()', () => {
    it('should load the player if it is not in the store yet', () => {
      expect(storeDispatchSpy).toHaveBeenCalledWith(loadPlayer({ playerId: 'FAKE_ID' }));
    });

    it('should load player\'s stats', () => {
      expect(fetchPlayerStatsSpy).toHaveBeenCalledWith('FAKE_ID');
    });
  });

  describe('when player loaded', () => {
    const stateWithFakePlayer = {
      ...initialState,
      players: {
        players: {
          ids: [
            'FAKE_ID',
          ],
          entities: {
            FAKE_ID: {
              joinedAt: '2019-08-09T20:45:56.785Z',
              steamId: '76561198977546450',
              name: 'niewielki',
              avatarUrl: 'FAKE_URL',
              role: 'admin',
              hasAcceptedRules: true,
              etf2lProfileId: 12345,
              id: 'FAKE_ID',
            }
          },
          locked: false
        },
      },
    };

    beforeEach(() => {
      store.setState(stateWithFakePlayer);
      fixture.detectChanges();
    });

    it('should be aware of the logged-in player role', () => {
      expect(fixture.debugElement.query(By.css('h4 small a.text-secondary'))).toBeNull();
      store.setState({ ...stateWithFakePlayer, profile: { profile: { role: 'admin' } } });
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('h4 small a.text-secondary'))).toBeTruthy();
    });

    it('should render admin badge', () => {
      const badge = fixture.debugElement.query(By.css('h4 span.badge')).nativeElement as HTMLElement;
      expect(badge).toBeTruthy();
      expect(badge.classList.contains('badge-warning')).toBe(true);
      expect(badge.innerText).toEqual('admin');
    });
  });
});
