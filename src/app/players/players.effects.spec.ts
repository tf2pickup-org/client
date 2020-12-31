import { ReplaySubject, of, throwError } from 'rxjs';
import { Action } from '@ngrx/store';
import { PlayerEffects } from './players.effects';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { PlayersService } from './players.service';
import { playerLoaded, loadPlayer, allPlayerSkillsLoaded, loadAllPlayerSkills, playerSkillLoaded, loadPlayerSkill,
  failedToLoadPlayerSkill, initializeDefaultPlayerSkill, playerEdited, setPlayerName, setPlayerRole, playerSkillEdited,
  setPlayerSkill } from './actions';
import { Player } from './models/player';
import { PlayerSkill } from './models/player-skill';
import { HttpErrorResponse } from '@angular/common/http';

const player: Player = {
  id: 'FAKE_PLAYER_ID',
  name: 'FAKE_PLAYER_NAME',
  joinedAt: new Date(),
  steamId: 'FAKE_STEAM_ID',
  avatar: {
    small: 'FAKE_SMALL_AVATAR_URL',
    medium: 'FAKE_MEDIUM_AVATAR_URL',
    large: 'FAKE_LARGE_AVATAR_URL',
  },
};

const allPlayerSkills: PlayerSkill[] = [
  { player: 'FAKE_PLAYER_ID', skill: { demoman: 5 } },
];

class PlayersServiceStub {
  fetchPlayer(playerId: string) { return of(player); }
  fetchAllPlayerSkills() { return of(allPlayerSkills); }
  setPlayerName(playerId: string, name: string) { return of({ ...player, name }); }
  setPlayerRole(playerId: string, role: string) { return of({ ...player, role }); }
  fetchPlayerSkill(playerId: string) { return of({ demoman: 5 }); }
  setPlayerSkill(playerId: string, skill: any) { return of(skill); }
  defaultSkill(playerId: string) { return of({ medic: 2 });
  }
}

describe('PlayerEffects', () => {
  let actions: ReplaySubject<Action>;
  let effects: PlayerEffects;
  let playersService: PlayersServiceStub;

  beforeEach(() => actions = new ReplaySubject<Action>(1));

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

  afterEach(() => actions.complete());

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

  describe('setPlayerName', () => {
    it('should attempt to set the new player name', () => {
      const spy = spyOn(playersService, 'setPlayerName').and.callThrough();
      effects.setPlayerName.subscribe(action => expect(action).toEqual(playerEdited({ player: { ...player, name: 'omgwtf' } })));
      actions.next(setPlayerName({ playerId: 'FAKE_PLAYER_ID', name: 'omgwtf' }));
      expect(spy).toHaveBeenCalledWith('FAKE_PLAYER_ID', 'omgwtf');
    });
  });

  describe('setPlayerRole', () => {
    it('should attempt to set the new player role', () => {
      const spy = spyOn(playersService, 'setPlayerRole').and.callThrough();
      effects.setPlayerRole.subscribe(action => expect(action).toEqual(playerEdited({ player: { ...player, role: 'admin' }})));
      actions.next(setPlayerRole({ playerId: 'FAKE_PLAYER_ID', role: 'admin' }));
      expect(spy).toHaveBeenCalledWith('FAKE_PLAYER_ID', 'admin');
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
      effects.loadPlayerSkill.subscribe(action => {
        expect(action).toEqual(playerSkillLoaded({ skill: { player: 'FAKE_PLAYER_ID', skill: { demoman: 5 } } }));
      });
      actions.next(loadPlayerSkill({ playerId: 'FAKE_PLAYER_ID' }));
      expect(spy).toHaveBeenCalledWith('FAKE_PLAYER_ID');
    });

    it('should handle http error 404', () => {
      const error = new HttpErrorResponse({ status: 404, statusText: 'Not found' });
      spyOn(playersService, 'fetchPlayerSkill').and.returnValue(throwError(error));
      effects.loadPlayerSkill.subscribe(action => {
        expect(action).toEqual(initializeDefaultPlayerSkill({ playerId: 'FAKE_PLAYER_ID' }));
      });
      actions.next(loadPlayerSkill({ playerId: 'FAKE_PLAYER_ID' }));
    });

    it('should handle all other http errors', () => {
      const error = new HttpErrorResponse({ });
      spyOn(playersService, 'fetchPlayerSkill').and.returnValue(throwError(error));
      effects.loadPlayerSkill.subscribe(action => {
        expect(action).toEqual(failedToLoadPlayerSkill({ error }));
      });
      actions.next(loadPlayerSkill({ playerId: 'FAKE_PLAYER_ID' }));
    });
  });

  describe('setPlayerSkill', () => {
    it('should attempt to set player skills', () => {
      const spy = spyOn(playersService, 'setPlayerSkill').and.callThrough();
      effects.setPlayerSkill.subscribe(action => expect(action).toEqual(
        playerSkillEdited({ skill: { player: 'FAKE_PLAYER_ID', skill: { demoman: 5 } } })
      ));
      actions.next(setPlayerSkill({ skill: { player: 'FAKE_PLAYER_ID', skill: { demoman: 5 } } }));
      expect(spy).toHaveBeenCalledWith('FAKE_PLAYER_ID', { demoman: 5 });
    });
  });

  describe('initializeDefaultPlayerSkill', () => {
    it('should init skill with default values', () => {
      const spy = spyOn(playersService, 'defaultSkill').and.callThrough();
      effects.initializeDefaultPlayerSkill.subscribe(action => {
        expect(action).toEqual(playerSkillLoaded({
          skill: {
            player: 'FAKE_PLAYER_ID',
            skill: { medic: 2 },
          },
        }));
      });
      actions.next(initializeDefaultPlayerSkill({ playerId: 'FAKE_PLAYER_ID' }));
      expect(spy).toHaveBeenCalledWith('FAKE_PLAYER_ID');
    });
  });
});
