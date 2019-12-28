import { ReplaySubject, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { PlayerEffects } from './players.effects';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { PlayersService } from './players.service';
import { playerLoaded, loadPlayer, allPlayerSkillsLoaded, loadAllPlayerSkills } from './actions';
import { Player } from './models/player';
import { PlayerSkill } from './models/player-skill';

const player: Player = {
  id: 'FAKE_PLAYER_ID',
  name: 'FAKE_PLAYER_NAME',
  joinedAt: new Date(),
  steamId: 'FAKE_STEAM_ID',
  avatarUrl: 'whatever',
  gameCount: 144,
};

const allPlayerSkills: PlayerSkill[] = [
  { player: 'FAKE_PLAYER_ID', skill: { demoman: 5 } },
];

class PlayersServiceStub {
  fetchPlayer(playerId: string) { return of(player); }
  fetchAllPlayerSkills() { return of(allPlayerSkills); }
}

describe('PlayerEffects', () => {
  const actions = new ReplaySubject<Action>(1);
  let effects: PlayerEffects;
  let playersService: PlayersServiceStub;

  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      PlayerEffects,
      provideMockActions(() => actions.asObservable()),
      { provide: PlayersService, useClass: PlayersServiceStub },
    ],
  }));

  beforeEach(() => {
    effects = TestBed.get(PlayerEffects);
    playersService = TestBed.get(PlayersService);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  describe('loadPlayer', () => {
    it('should attempt to fetch the given player', () => {
      const spy = spyOn(playersService, 'fetchPlayer').and.callThrough();
      effects.loadPlayer.subscribe(action => expect(action).toEqual(playerLoaded({ player })));
      actions.next(loadPlayer({ playerId: 'FAKE_PLAYER_ID' }));
      expect(spy).toHaveBeenCalledWith('FAKE_PLAYER_ID');
    });
  });

  describe('loadAllPlayerSkills', () => {
    it('should attempt to fetch all the player skills', () => {
      const spy = spyOn(playersService, 'fetchAllPlayerSkills').and.callThrough();
      effects.loadAllPlayerSkills.subscribe(action => expect(action).toEqual(allPlayerSkillsLoaded({ playerSkills: allPlayerSkills })));
      actions.next(loadAllPlayerSkills());
      expect(spy).toHaveBeenCalled();
    });
  });
});
