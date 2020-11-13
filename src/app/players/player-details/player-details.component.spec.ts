import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
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
import { BsModalService } from 'ngx-bootstrap/modal';
import { EditPlayerRoleDialogComponent } from '../edit-player-role-dialog/edit-player-role-dialog.component';
import { TwitchTvProfileLinkPipe } from '../twitch-tv-profile-link.pipe';

class PlayersServiceStub {
  fetchPlayerStats() { return of({}); }
}

const paramMap = of(convertToParamMap({ id: 'FAKE_ID' }));

class BsModalServiceStub {
  show(component: any, config: any) { }
}

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
    profile: { },
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        Etf2lProfileLinkPipe,
        LogsTfProfileLinkPipe,
        SteamProfileLinkPipe,
        PlayerDetailsComponent,
        TwitchTvProfileLinkPipe,
      ],
      imports: [
        RouterTestingModule,
      ],
      providers: [
        { provide: PlayersService, useClass: PlayersServiceStub  },
        provideMockStore({ initialState }),
        { provide: ActivatedRoute, useValue: { paramMap } },
        { provide: BsModalService, useClass: BsModalServiceStub },
      ],
      schemas: [ NO_ERRORS_SCHEMA ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.inject(Store) as MockStore<{ }>;
    storeDispatchSpy = spyOn(store, 'dispatch').and.callThrough();
    fetchPlayerStatsSpy = spyOn(TestBed.inject(PlayersService), 'fetchPlayerStats').and.callThrough();

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
      expect(fetchPlayerStatsSpy).toHaveBeenCalledWith('FAKE_ID');
    });
  });

  describe('when player loaded', () => {
    const player = {
      joinedAt: '2019-08-09T20:45:56.785Z',
      steamId: '76561198977546450',
      name: 'niewielki',
      avatarUrl: 'FAKE_URL',
      role: 'admin',
      hasAcceptedRules: true,
      etf2lProfileId: 12345,
      id: 'FAKE_ID',
    }

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

    it('should be aware of the logged-in player role', () => {
      expect(fixture.debugElement.query(By.css('h4 small a.text-secondary'))).toBeNull();
      store.setState({ ...stateWithFakePlayer, profile: { role: 'admin' } });
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('h4 small a.text-secondary'))).toBeTruthy();
    });

    it('should render admin badge', () => {
      const badge = fixture.debugElement.query(By.css('h4 span.badge')).nativeElement as HTMLElement;
      expect(badge).toBeTruthy();
      expect(badge.classList.contains('badge-warning')).toBe(true);
      expect(badge.innerText).toEqual('admin');
    });

    describe('with twitch.tv profile', () => {
      beforeEach(() => {
        store.setState({...initialState,
          players: {
            players: {
              ids: [
                'FAKE_ID',
              ],
              entities: {
                FAKE_ID: { ...player, twitchTvUser: { login: 'FAKE_TWITCH_LOGIN' } },
              },
              locked: false
            },
          },
        });
        fixture.detectChanges();
      });

      it('should render a link to the twitch.tv profile', () => {
        const anchor = fixture.debugElement.query(By.css('a.text-twitch')).nativeElement as HTMLAnchorElement;
        expect(anchor).toBeTruthy();
        expect(anchor.href).toEqual('https://www.twitch.tv/FAKE_TWITCH_LOGIN/');
      });
    });

    describe('#openEditPlayerRoleDialog()', () => {
      it('should open the dialog with the player in the initial state', () => {
        const spy = spyOn(TestBed.inject(BsModalService), 'show').and.callThrough();
        component.openEditPlayerRoleDialog();
        expect(spy).toHaveBeenCalledWith(EditPlayerRoleDialogComponent, {
          initialState: {
            player: jasmine.objectContaining({
              id: 'FAKE_ID',
              role: 'admin',
              name: 'niewielki',
            })
          },
        });
      });
    });
  });
});
