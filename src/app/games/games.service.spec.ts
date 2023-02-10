import { TestBed, inject } from '@angular/core/testing';
import { GamesService } from './games.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { API_URL } from '@app/api-url';
import { NEVER } from 'rxjs';
import { Socket } from '@app/io/socket';

class SocketStub {
  call() {
    return NEVER;
  }
}

describe('GamesService', () => {
  let httpController: HttpTestingController;

  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: API_URL, useValue: 'FAKE_URL' },
        { provide: Socket, useClass: SocketStub },
      ],
    }),
  );

  beforeEach(() => {
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpController.verify());

  it('should be created', () => {
    const service: GamesService = TestBed.inject(GamesService);
    expect(service).toBeTruthy();
  });

  describe('#fetchGames()', () => {
    it('should call api endpoint', inject(
      [GamesService],
      (service: GamesService) => {
        service.fetchGames(0).subscribe();
        httpController.expectOne('FAKE_URL/games?offset=0&limit=10');

        service.fetchGames(28, 35).subscribe();
        httpController.expectOne('FAKE_URL/games?offset=28&limit=35');

        expect().nothing();
      },
    ));
  });

  describe('#fetchGame()', () => {
    it('should call api endpoint', inject(
      [GamesService],
      (service: GamesService) => {
        service.fetchGame('FAKE_ID').subscribe();
        httpController.expectOne('FAKE_URL/games/FAKE_ID');
        expect().nothing();
      },
    ));
  });

  describe('#forceEndGame()', () => {
    it('should call api endpoint', inject(
      [GamesService],
      (service: GamesService) => {
        service.forceEndGame('FAKE_ID').subscribe();
        const req = httpController.expectOne(
          'FAKE_URL/games/FAKE_ID/force-end',
        );
        expect(req.request.method).toBe('PUT');
      },
    ));
  });

  describe('#reinitializeServer()', () => {
    it('should call api endpoint', inject(
      [GamesService],
      (service: GamesService) => {
        service.reinitializeServer('FAKE_ID').subscribe();
        const req = httpController.expectOne(
          'FAKE_URL/games/FAKE_ID/reinitialize-gameserver',
        );
        expect(req.request.method).toBe('PUT');
      },
    ));
  });

  describe('#reassign()', () => {
    it('should call api endpoint', inject(
      [GamesService],
      (service: GamesService) => {
        service
          .reassign('FAKE_GAME_ID', {
            id: 'FAKE_GAMESERVER_ID',
            provider: 'test',
          })
          .subscribe();
        const req = httpController.expectOne(
          'FAKE_URL/games/FAKE_GAME_ID/assign-gameserver',
        );
        expect(req.request.method).toBe('PUT');
        expect(req.request.body).toEqual({
          id: 'FAKE_GAMESERVER_ID',
          provider: 'test',
        });
      },
    ));
  });

  describe('#fetchGameSkills()', () => {
    it('should call api endpoint', inject(
      [GamesService],
      (service: GamesService) => {
        service.fetchGameSkills('FAKE_ID').subscribe();
        const req = httpController.expectOne('FAKE_URL/games/FAKE_ID/skills');
        expect(req.request.method).toBe('GET');
      },
    ));
  });

  describe('#requestSubstitute()', () => {
    it('should call api endpoint', inject(
      [GamesService],
      (service: GamesService) => {
        service.requestSubstitute('FAKE_GAME_ID', 'FAKE_PLAYER_ID').subscribe();
        const req = httpController.expectOne(
          'FAKE_URL/games/FAKE_GAME_ID/substitute-player?player=FAKE_PLAYER_ID',
        );
        expect(req.request.method).toBe('PUT');
      },
    ));
  });

  describe('#cancelSubstitutionRequest()', () => {
    it('should call api endpoint', inject(
      [GamesService],
      (service: GamesService) => {
        service
          .cancelSubstitutionRequest('FAKE_GAME_ID', 'FAKE_PLAYER_ID')
          .subscribe();
        const req = httpController.expectOne(
          'FAKE_URL/games/FAKE_GAME_ID/cancel-player-substitute?player=FAKE_PLAYER_ID',
        );
        expect(req.request.method).toBe('PUT');
      },
    ));
  });

  describe('#replacePlayer()', () => {
    it('should call ws method', inject(
      [GamesService],
      (service: GamesService) => {
        const spy = spyOn(TestBed.inject(Socket), 'call');
        service.replacePlayer('FAKE_GAME_ID', 'FAKE_PLAYER_ID');
        expect(spy).toHaveBeenCalledWith('replace player', {
          gameId: 'FAKE_GAME_ID',
          replaceeId: 'FAKE_PLAYER_ID',
        });
      },
    ));
  });

  describe('#fetchConnectInfo()', () => {
    it('should call api endpoint', inject(
      [GamesService],
      (service: GamesService) => {
        service.fetchConnectInfo('FAKE_GAME_ID').subscribe();
        const req = httpController.expectOne(
          'FAKE_URL/games/FAKE_GAME_ID/connect-info',
        );
        expect(req.request.method).toBe('GET');
      },
    ));
  });
});
