import { TestBed, inject } from '@angular/core/testing';
import { GameServersService } from './game-servers.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { API_URL } from '@app/api-url';
import { GameServer } from './models/game-server';

describe('GameServersService', () => {
  let httpController: HttpTestingController;

  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule,
    ],
    providers: [
      { provide: API_URL, useValue: 'FAKE_URL' },
    ],
  }));

  beforeEach(() => {
    httpController = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    const service: GameServersService = TestBed.get(GameServersService);
    expect(service).toBeTruthy();
  });

  describe('#fetchGameServers()', () => {
    it('should call the endpoint', inject([GameServersService], (service: GameServersService) => {
      service.fetchGameServers().subscribe();
      httpController.expectOne('FAKE_URL/game-servers');
      expect().nothing();
    }));
  });

  describe('#addGameServer()', () => {
    it('should call the endpoint', inject([GameServersService], (service: GameServersService) => {
      const server: GameServer = { name: 'FAKE_NAME', address: 'FAKE_ADDRESS', port: '1234' };
      service.addGameServer(server).subscribe();
      const req = httpController.expectOne('FAKE_URL/game-servers');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(server);
    }));
  });

  describe('#removeGameServer()', () => {
    it('should call the endpoint', inject([GameServersService], (service: GameServersService) => {
      service.removeGameServer('FAKE_ID').subscribe();
      const req = httpController.expectOne('FAKE_URL/game-servers/FAKE_ID');
      expect(req.request.method).toBe('DELETE');
    }));
  });
});
