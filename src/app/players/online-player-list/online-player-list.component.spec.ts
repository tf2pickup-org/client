import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import {
  MockBuilder,
  MockedComponentFixture,
  MockRenderFactory,
  ngMocks,
} from 'ng-mocks';
import { loadOnlinePlayers } from '../actions';
import { Player } from '../models/player';
import {
  onlinePlayerCount,
  onlinePlayers,
  onlinePlayersLoaded,
} from '../selectors';
import { OnlinePlayerListComponent } from './online-player-list.component';

describe(OnlinePlayerListComponent.name, () => {
  const factory = MockRenderFactory(OnlinePlayerListComponent);
  let component: OnlinePlayerListComponent;
  let fixture: MockedComponentFixture<OnlinePlayerListComponent>;
  let store: MockStore;

  ngMocks.faster();

  beforeAll(() =>
    MockBuilder(OnlinePlayerListComponent)
      .provide(provideMockStore())
      .mock(RouterModule)
      .keep(NoopAnimationsModule),
  );
  beforeAll(() => factory.configureTestBed());

  beforeEach(() => {
    store = TestBed.inject(MockStore);
    store.overrideSelector(onlinePlayers, []);
    store.overrideSelector(onlinePlayerCount, 0);
    store.overrideSelector(onlinePlayersLoaded, false);
    spyOn(store, 'dispatch');
  });

  afterEach(() => TestBed.inject(MockStore)?.resetSelectors());

  describe('when the online players are not loaded', () => {
    beforeEach(() => {
      onlinePlayersLoaded.setResult(false);
      store.refreshState();

      fixture = factory();
      component = fixture.point.componentInstance;
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should attempt to fetch online players', () => {
      expect(store.dispatch).toHaveBeenCalledOnceWith(loadOnlinePlayers());
    });
  });

  describe('when the online players are loaded', () => {
    beforeEach(() => {
      onlinePlayersLoaded.setResult(true);
      store.refreshState();

      fixture = factory();
      component = fixture.point.componentInstance;
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should not attempt to fetch online players', () => {
      expect(store.dispatch).not.toHaveBeenCalled();
    });

    it('should render online player count', () => {
      const strong = ngMocks.find('.online-player-count')
        .nativeElement as HTMLSpanElement;
      expect(strong.textContent.trim()).toEqual('0');
    });

    describe('with online players', () => {
      beforeEach(() => {
        onlinePlayers.setResult([
          {
            name: 'maly',
            avatar: {
              small:
                'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/96/962ac5adb6b0cce647227a2c429c035e56197fb2.jpg',
              medium:
                'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/96/962ac5adb6b0cce647227a2c429c035e56197fb2_medium.jpg',
              large:
                'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/96/962ac5adb6b0cce647227a2c429c035e56197fb2_full.jpg',
            },
            roles: ['admin', 'super user'],
            id: '612412523231b954417c429f',
          } as Player,
          {
            name: 'majiwem171',
            avatar: {
              small:
                'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb.jpg',
              medium:
                'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_medium.jpg',
              large:
                'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg',
            },
            roles: [],
            id: '612412b63231b954417c42e8',
          } as Player,
        ]);
        onlinePlayerCount.setResult(2);
        // onlinePlayersLoaded.setResult(true);
        store.refreshState();
        fixture.detectChanges();
      });

      it('should render online players', () => {
        const links = ngMocks
          .findAll('a')
          .map(e => e.nativeElement) as HTMLAnchorElement[];

        expect(links.length).toBe(2);
      });

      it('should update online player count', () => {
        const strong = ngMocks.find('.online-player-count')
          .nativeElement as HTMLSpanElement;
        expect(strong.textContent.trim()).toEqual('2');
      });
    });
  });
});
