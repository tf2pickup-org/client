import { ReplaySubject, of, throwError } from 'rxjs';
import { Action } from '@ngrx/store';
import { PlayerEffects } from './players.effects';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { PlayersService } from './players.service';
import { playerLoaded, loadPlayer, allPlayerSkillsLoaded, loadAllPlayerSkills, playerSkillLoaded, loadPlayerSkill,
  failedToLoadPlayerSkill } from './actions';
import { Player } from './models/player';
import { PlayerSkill } from './models/player-skill';
import { HttpErrorResponse } from '@angular/common/http';

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
  fetchPlayerSkill(playerId: string) { return of(allPlayerSkills[0]); }
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

  describe('loadPlayerSkill', () => {
    it('should attempt to fetch player skill', () => {
      const spy = spyOn(playersService, 'fetchPlayerSkill').and.callThrough();
      effects.loadPlayerSkill.subscribe(action => expect(action).toEqual(playerSkillLoaded({ playerSkill: allPlayerSkills[0] })));
      actions.next(loadPlayerSkill({ playerId: 'FAKE_PLAYER_ID' }));
      expect(spy).toHaveBeenCalledWith('FAKE_PLAYER_ID');
    });

    it('should handle errors', () => {
      const error = new HttpErrorResponse({ });
      spyOn(playersService, 'fetchPlayerSkill').and.returnValue(throwError(error));
      effects.loadPlayerSkill.subscribe(action => expect(action).toEqual(failedToLoadPlayerSkill({ error })));
      actions.next(loadPlayerSkill({ playerId: 'FAKE_PLAYER_ID' }));
    });
  });
});
