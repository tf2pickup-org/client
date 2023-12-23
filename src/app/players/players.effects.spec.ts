import { ReplaySubject, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { PlayerEffects } from './players.effects';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { PlayersService } from './players.service';
import {
  playerLoaded,
  loadPlayer,
  linkedProfilesLoaded,
  loadLinkedProfiles,
  onlinePlayersLoaded,
  loadOnlinePlayers,
} from './actions';
import { Player } from './models/player';
import { LinkedProfiles } from './models/linked-profiles';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Socket } from '@app/io/socket';
import { EventEmitter } from 'eventemitter3';

const mockPlayer: Player = {
  id: 'FAKE_PLAYER_ID',
  name: 'FAKE_PLAYER_NAME',
  joinedAt: new Date(),
  steamId: 'FAKE_STEAM_ID',
  roles: [],
  avatar: {
    small: 'FAKE_SMALL_AVATAR_URL',
    medium: 'FAKE_MEDIUM_AVATAR_URL',
    large: 'FAKE_LARGE_AVATAR_URL',
  },
  _links: [],
};

const linkedProfiles: LinkedProfiles = {
  playerId: 'FAKE_PLAYER_ID',
  linkedProfiles: [
    {
      provider: 'twitch.tv',
      player: 'FAKE_PLAYER_ID',
      login: 'FAKE_LOGIN',
      userId: 'FAKE_USER_ID',
    },
  ],
};

const onlinePlayers: Player[] = [
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
    roles: [] as Player['roles'],
    id: '612412b63231b954417c42e8',
  } as Player,
];

describe('PlayerEffects', () => {
  let actions: ReplaySubject<Action>;
  let effects: PlayerEffects;
  let playersService: jasmine.SpyObj<PlayersService>;
  let store: MockStore;

  beforeEach(() => {
    actions = new ReplaySubject<Action>(1);
    playersService = jasmine.createSpyObj<PlayersService>(PlayersService.name, [
      'fetchPlayer',
      'fetchPlayerLinkedProfiles',
      'fetchOnlinePlayers',
    ]);
    playersService.fetchPlayer.and.returnValue(of(mockPlayer));
    playersService.fetchPlayerLinkedProfiles.and.returnValue(
      of(linkedProfiles),
    );
    playersService.fetchOnlinePlayers.and.returnValue(of(onlinePlayers));
  });

  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [
        PlayerEffects,
        provideMockActions(() => actions.asObservable()),
        { provide: PlayersService, useValue: playersService },
        provideMockStore(),
        { provide: Socket, useClass: EventEmitter },
      ],
    }),
  );

  beforeEach(() => {
    effects = TestBed.inject(PlayerEffects);
    playersService = TestBed.inject(
      PlayersService,
    ) as jasmine.SpyObj<PlayersService>;
    store = TestBed.inject(MockStore);

    spyOn(store, 'dispatch');
  });

  afterEach(() => actions.complete());
  afterEach(() => TestBed.inject(MockStore)?.resetSelectors());

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  describe('loadPlayer', () => {
    it('should attempt to fetch the given player', () => {
      effects.loadPlayer.subscribe(action =>
        expect(action).toEqual(playerLoaded({ player: mockPlayer })),
      );
      actions.next(loadPlayer({ playerId: 'FAKE_PLAYER_ID' }));
      expect(playersService.fetchPlayer).toHaveBeenCalledWith('FAKE_PLAYER_ID');
    });
  });

  describe('loadLinkedProfiles', () => {
    it('should attempt to fetch the linked profiles', done => {
      effects.loadLinkedProfiles.subscribe(action => {
        expect(action).toEqual(linkedProfilesLoaded({ linkedProfiles }));
        done();
      });
      actions.next(loadLinkedProfiles({ playerId: 'FAKE_PLAYER_ID' }));
      expect(playersService.fetchPlayerLinkedProfiles).toHaveBeenCalledOnceWith(
        'FAKE_PLAYER_ID',
      );
    });
  });

  describe('loadOnlinePlayers', () => {
    it('should attempt to fetch the online players', done => {
      effects.loadOnlinePlayers.subscribe(action => {
        expect(action).toEqual(onlinePlayersLoaded({ players: onlinePlayers }));
        done();
      });
      actions.next(loadOnlinePlayers());
      expect(playersService.fetchOnlinePlayers).toHaveBeenCalledTimes(1);
    });
  });
});
