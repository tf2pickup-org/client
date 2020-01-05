import { TestBed, inject } from '@angular/core/testing';
import { GamesService } from './games.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { API_URL } from '@app/api-url';

describe('GamesService', () => {
  let httpController: HttpTestingController;

  beforeEach(() => TestBed.configureTestingModule({
    imports: [ HttpClientTestingModule ],
    providers: [
      { provide: API_URL, useValue: 'FAKE_URL' },
    ]
  }));

  beforeEach(() => {
    httpController = TestBed.get(HttpTestingController);
  });

  afterEach(() => httpController.verify());

  it('should be created', () => {
    const service: GamesService = TestBed.get(GamesService);
    expect(service).toBeTruthy();
  });

  describe('#fetchGames()', () => {
    it('should call api endpoint', inject([GamesService], (service: GamesService) => {
      service.fetchGames(0).subscribe();
      httpController.expectOne('FAKE_URL/games?offset=0&limit=10');

      service.fetchGames(28, 35).subscribe();
      httpController.expectOne('FAKE_URL/games?offset=28&limit=35');

      expect().nothing();
    }));
  });

  describe('#fetchGame()', () => {
    it('should call api endpoint', inject([GamesService], (service: GamesService) => {
      service.fetchGame('FAKE_ID').subscribe();
      httpController.expectOne('FAKE_URL/games/FAKE_ID');
      expect().nothing();
    }));
  });

  describe('#forceEndGame()', () => {
    it('should call api endpoint', inject([GamesService], (service: GamesService) => {
      service.forceEndGame('FAKE_ID').subscribe();
      const req = httpController.expectOne('FAKE_URL/games/FAKE_ID?force_end');
      expect(req.request.method).toBe('POST');
    }));
  });

  describe('#reinitializeServer()', () => {
    it('should call api endpoint', inject([GamesService], (service: GamesService) => {
      service.reinitializeServer('FAKE_ID').subscribe();
      const req = httpController.expectOne('FAKE_URL/games/FAKE_ID?reinitialize_server');
      expect(req.request.method).toBe('POST');
    }));
  });

  describe('#fetchGameSkills()', () => {
    it('should call api endpoint', inject([GamesService], (service: GamesService) => {
      service.fetchGameSkills('FAKE_ID').subscribe();
      const req = httpController.expectOne('FAKE_URL/games/FAKE_ID/skills');
      expect(req.request.method).toBe('GET');
    }));
  });

  describe('#requestSubstitute()', () => {
    it('should call api endpoint', inject([GamesService], (service: GamesService) => {
      service.requestSubstitute('FAKE_GAME_ID', 'FAKE_PLAYER_ID').subscribe();
      const req = httpController.expectOne('FAKE_URL/games/FAKE_GAME_ID?substitute_player=FAKE_PLAYER_ID');
      expect(req.request.method).toBe('POST');
    }));
  });

  describe('#cancelSubstitutionRequest()', () => {
    it('should call api endpoint', inject([GamesService], (service: GamesService) => {
      service.cancelSubstitutionRequest('FAKE_GAME_ID', 'FAKE_PLAYER_ID').subscribe();
      const req = httpController.expectOne('FAKE_URL/games/FAKE_GAME_ID?substitute_player_cancel=FAKE_PLAYER_ID');
      expect(req.request.method).toBe('POST');
    }));
  });
});
