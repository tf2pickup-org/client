import { ReplaySubject, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { PlayerEffects } from './players.effects';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { PlayersService } from './players.service';
import { playerLoaded, loadPlayer } from './actions';
import { Player } from './models/player';

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

describe('PlayerEffects', () => {
  let actions: ReplaySubject<Action>;
  let effects: PlayerEffects;
  let playersService: jasmine.SpyObj<PlayersService>;

  beforeEach(() => {
    actions = new ReplaySubject<Action>(1);
    playersService = jasmine.createSpyObj<PlayersService>(PlayersService.name, [
      'fetchPlayer',
    ]);
    playersService.fetchPlayer.and.returnValue(of(mockPlayer));
  });

  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [
        PlayerEffects,
        provideMockActions(() => actions.asObservable()),
        { provide: PlayersService, useValue: playersService },
      ],
    }),
  );

  beforeEach(() => {
    effects = TestBed.get(PlayerEffects);
    playersService = TestBed.get(PlayersService);
  });

  afterEach(() => actions.complete());

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
});
