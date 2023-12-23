import { TestBed, inject } from '@angular/core/testing';
import { PlayersService } from './players.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { API_URL } from '@app/api-url';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { Store } from '@ngrx/store';
import { AppState } from '@app/app.state';
import { QueueConfig } from '@app/queue/models/queue-config';
import { queueConfig } from '@app/queue/queue.selectors';

const initialQueueConfig = {
  teamCount: 2,
  classes: [
    {
      name: 'scout',
      count: 2,
    },
    {
      name: 'soldier',
      count: 2,
    },
    {
      name: 'demoman',
      count: 1,
    },
    {
      name: 'medic',
      count: 1,
    },
  ],
};

describe('PlayersService', () => {
  let httpContoller: HttpTestingController;
  let store: MockStore<AppState>;

  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: API_URL, useValue: 'FAKE_URL' },
        provideMockStore(),
      ],
    }),
  );

  beforeEach(() => {
    httpContoller = TestBed.get(HttpTestingController);
    store = TestBed.get(Store);
    store.overrideSelector(queueConfig, initialQueueConfig as QueueConfig);
  });
  afterEach(() => httpContoller.verify());
  afterEach(() => TestBed.inject(MockStore)?.resetSelectors());

  it('should be created', () => {
    const service: PlayersService = TestBed.get(PlayersService);
    expect(service).toBeTruthy();
  });

  describe('#fetchPlayer()', () => {
    it('should call the endpoint', inject(
      [PlayersService],
      (service: PlayersService) => {
        service.fetchPlayer('FAKE_ID').subscribe();
        httpContoller.expectOne('FAKE_URL/players/FAKE_ID');
        expect().nothing();
      },
    ));
  });

  describe('#fetchPlayerGames()', () => {
    it('should call the endpoint', inject(
      [PlayersService],
      (service: PlayersService) => {
        service.fetchPlayerGames('FAKE_ID', 0).subscribe();
        httpContoller.expectOne(
          'FAKE_URL/games?player=FAKE_ID&offset=0&limit=10',
        );

        service.fetchPlayerGames('FAKE_ID', 28, 53).subscribe();
        httpContoller.expectOne(
          'FAKE_URL/games?player=FAKE_ID&offset=28&limit=53',
        );

        expect().nothing();
      },
    ));
  });

  describe('#setPlayerName()', () => {
    it('should call the endpoint', inject(
      [PlayersService],
      (service: PlayersService) => {
        service.setPlayerName('FAKE_PLAYER_ID', 'ho ho ho').subscribe();
        const req = httpContoller.expectOne('FAKE_URL/players/FAKE_PLAYER_ID');
        expect(req.request.method).toBe('PATCH');
        expect(req.request.body).toEqual({ name: 'ho ho ho' });
      },
    ));
  });

  describe('#setPlayerRoles()', () => {
    it('should call the endpoint', inject(
      [PlayersService],
      (service: PlayersService) => {
        service.setPlayerRoles('FAKE_PLAYER_ID', ['admin']).subscribe();
        const req = httpContoller.expectOne('FAKE_URL/players/FAKE_PLAYER_ID');
        expect(req.request.method).toBe('PATCH');
        expect(req.request.body).toEqual({ roles: ['admin'] });
      },
    ));
  });

  describe('#setPlayerSkill()', () => {
    it('should call the endpoint', inject(
      [PlayersService],
      (service: PlayersService) => {
        service.setPlayerSkill('FAKE_PLAYER_ID', { demoman: 3 }).subscribe();
        const req = httpContoller.expectOne(
          'FAKE_URL/players/FAKE_PLAYER_ID/skill',
        );
        expect(req.request.method).toBe('PUT');
        expect(req.request.body).toEqual({ demoman: 3 });
      },
    ));
  });

  describe('#fetchAllPlayerSkills()', () => {
    it('should call the endpoint', inject(
      [PlayersService],
      (service: PlayersService) => {
        service.fetchAllPlayerSkills().subscribe();
        const req = httpContoller.expectOne('FAKE_URL/players/all/skill');
        expect(req.request.method).toBe('GET');
      },
    ));
  });

  describe('#fetchPlayerSkill()', () => {
    it('should call the endpoint', inject(
      [PlayersService],
      (service: PlayersService) => {
        service.fetchPlayerSkill('FAKE_ID').subscribe();
        const req = httpContoller.expectOne('FAKE_URL/players/FAKE_ID/skill');
        expect(req.request.method).toBe('GET');
      },
    ));
  });

  describe('#resetPlayerSkill()', () => {
    it('should call the endpoint', inject(
      [PlayersService],
      (service: PlayersService) => {
        service.resetPlayerSkill('FAKE_ID').subscribe();
        const req = httpContoller.expectOne('FAKE_URL/players/FAKE_ID/skill');
        expect(req.request.method).toBe('DELETE');
      },
    ));
  });

  describe('#fetchAllPlayers', () => {
    it('should call the endpoint', inject(
      [PlayersService],
      (service: PlayersService) => {
        service.fetchAllPlayers().subscribe();
        httpContoller.expectOne('FAKE_URL/players');
        expect().nothing();
      },
    ));
  });

  describe('#fetchPlayerStats()', () => {
    it('should call the endpoint', inject(
      [PlayersService],
      (service: PlayersService) => {
        service.fetchPlayerStats('FAKE_ID').subscribe();
        httpContoller.expectOne('FAKE_URL/players/FAKE_ID/stats');
        expect().nothing();
      },
    ));
  });

  describe('#fetchPlayerBans()', () => {
    it('should call the endpoint', inject(
      [PlayersService],
      (service: PlayersService) => {
        service.fetchPlayerBans('FAKE_ID').subscribe();
        httpContoller.expectOne('FAKE_URL/players/FAKE_ID/bans');
        expect().nothing();
      },
    ));
  });

  describe('#addPlayerBan()', () => {
    it('should call the endpoint', inject(
      [PlayersService],
      (service: PlayersService) => {
        const ban = {
          id: 'FAKE_BAN_ID',
          player: 'FAKE_PLAYER_ID',
          reason: 'FAKE_REASON',
        };
        service.addPlayerBan(ban).subscribe();
        const req = httpContoller.expectOne(
          'FAKE_URL/players/FAKE_PLAYER_ID/bans',
        );
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(ban);
      },
    ));
  });

  describe('#revokePlayerBan()', () => {
    it('should call the endpoint', inject(
      [PlayersService],
      (service: PlayersService) => {
        const ban = {
          id: 'FAKE_BAN_ID',
          player: 'FAKE_PLAYER_ID',
          admin: 'FAKE_ADMIN_ID',
          start: new Date(),
          end: new Date(),
          reason: 'FAKE_REASON',
        };

        service.revokePlayerBan(ban).subscribe();
        const req = httpContoller.expectOne(
          'FAKE_URL/players/FAKE_PLAYER_ID/bans/FAKE_BAN_ID?revoke',
        );
        expect(req.request.method).toBe('POST');
      },
    ));
  });

  describe('#forceCreatePlayer()', () => {
    it('should post the new player', inject(
      [PlayersService],
      (service: PlayersService) => {
        service
          .forceCreatePlayer({
            name: 'FAKE_PLAYER_NAME',
            steamId: 'FAKE_STEAM_ID',
          })
          .subscribe();
        const req = httpContoller.expectOne('FAKE_URL/players');
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual({
          name: 'FAKE_PLAYER_NAME',
          steamId: 'FAKE_STEAM_ID',
        });
      },
    ));
  });

  describe('#fetchPlayerLinkedProfiles()', () => {
    it('should query the api', inject(
      [PlayersService],
      (service: PlayersService) => {
        service.fetchPlayerLinkedProfiles('FAKE_PLAYER_ID').subscribe();
        httpContoller.expectOne(
          'FAKE_URL/players/FAKE_PLAYER_ID/linked-profiles',
        );
        expect().nothing();
      },
    ));
  });

  describe('#fetchOnlinePlayers()', () => {
    it('should query the api', inject(
      [PlayersService],
      (service: PlayersService) => {
        service.fetchOnlinePlayers().subscribe();
        httpContoller.expectOne('FAKE_URL/online-players');
        expect().nothing();
      },
    ));
  });

  // TODO Write tests for importing player skills
});
