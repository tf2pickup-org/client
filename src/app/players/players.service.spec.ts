import { TestBed, inject } from '@angular/core/testing';
import { PlayersService } from './players.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { API_URL } from '@app/api-url';
import { Player } from './models/player';

describe('PlayersService', () => {
  let httpContoller: HttpTestingController;

  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule,
    ],
    providers: [
      { provide: API_URL, useValue: 'FAKE_URL' },
    ]
  }));


  beforeEach(() => httpContoller = TestBed.get(HttpTestingController));
  afterEach(() => httpContoller.verify());

  it('should be created', () => {
    const service: PlayersService = TestBed.get(PlayersService);
    expect(service).toBeTruthy();
  });

  describe('#fetchPlayer()', () => {
    it('should call the endpoint', inject([PlayersService], (service: PlayersService) => {
      service.fetchPlayer('FAKE_ID').subscribe();
      httpContoller.expectOne('FAKE_URL/players/FAKE_ID');
      expect().nothing();
    }));
  });

  describe('#fetchPlayerGames()', () => {
    it('should call the endpoint', inject([PlayersService], (service: PlayersService) => {
      service.fetchPlayerGames('FAKE_ID', 0).subscribe();
      httpContoller.expectOne('FAKE_URL/players/FAKE_ID/games?offset=0&limit=10');

      service.fetchPlayerGames('FAKE_ID', 28, 53).subscribe();
      httpContoller.expectOne('FAKE_URL/players/FAKE_ID/games?offset=28&limit=53');

      expect().nothing();
    }));
  });

  describe('#savePlayer()', () => {
    it('should call the endpoint', inject([PlayersService], (service: PlayersService) => {
      const player: Player = { id: 'FAKE_ID', name: 'FAKE_NAME', joinedAt: new Date(), steamId: 'FAKE_STEAM_ID',
        avatarUrl: 'FAKE_AVATAR_URL', skill: { soldier: 3 }, gameCount: 0 };
      service.savePlayer(player).subscribe();
      const req = httpContoller.expectOne('FAKE_URL/players/FAKE_ID');
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual({ name: 'FAKE_NAME' });
      const req2 = httpContoller.expectOne('FAKE_URL/players/FAKE_ID/skill');
      expect(req2.request.method).toBe('PUT');
      expect(req2.request.body).toEqual({ player: 'FAKE_ID', skill: player.skill });
    }));
  });

  describe('#fetchPlayerSkill()', () => {
    it('should call the endpoint', inject([PlayersService], (service: PlayersService) => {
      service.fetchPlayerSkill('FAKE_ID').subscribe();
      httpContoller.expectOne('FAKE_URL/players/FAKE_ID/skill');
      expect().nothing();
    }));
  });

  describe('#fetchAllPlayers', () => {
    it('should call the endpoint', inject([PlayersService], (service: PlayersService) => {
      service.fetchAllPlayers().subscribe();
      httpContoller.expectOne('FAKE_URL/players');
      expect().nothing();
    }));
  });

  describe('#fetchPlayerStats()', () => {
    it('should call the endpoint', inject([PlayersService], (service: PlayersService) => {
      service.fetchPlayerStats('FAKE_ID').subscribe();
      httpContoller.expectOne('FAKE_URL/players/FAKE_ID/stats');
      expect().nothing();
    }));
  });

  describe('#fetchPlayerBans()', () => {
    it('should call the endpoint', inject([PlayersService], (service: PlayersService) => {
      service.fetchPlayerBans('FAKE_ID').subscribe();
      httpContoller.expectOne('FAKE_URL/players/FAKE_ID/bans');
      expect().nothing();
    }));
  });

  describe('#addPlayerBan()', () => {
    it('should call the endpoint', inject([PlayersService], (service: PlayersService) => {
      const ban = { player: 'FAKE_ID', reason: 'FAKE_REASON' };
      service.addPlayerBan(ban).subscribe();
      const req = httpContoller.expectOne('FAKE_URL/players/FAKE_ID/bans');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(ban);
    }));
  });

  describe('#revokePlayerBan()', () => {
    it('should call the endpoint', inject([PlayersService], (service: PlayersService) => {
      const ban = {
        id: 'FAKE_BAN_ID',
        player: 'FAKE_PLAYER_ID',
        admin: 'FAKE_ADMIN_ID',
        start: new Date(),
        end: new Date(),
        reason: 'FAKE_REASON',
      };

      service.revokePlayerBan(ban).subscribe();
      const req = httpContoller.expectOne('FAKE_URL/players/FAKE_PLAYER_ID/bans?revoke');
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(ban);
    }));
  });
});
