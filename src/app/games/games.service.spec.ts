import { TestBed, inject } from '@angular/core/testing';
import { GamesService } from './games.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { API_URL } from '@app/api-url';
import { IoClientService } from '@app/core/io-client.service';

class IoClientServiceStub {

}

describe('GamesService', () => {
  let httpController: HttpTestingController;

  beforeEach(() => TestBed.configureTestingModule({
    imports: [ HttpClientTestingModule ],
    providers: [
      { provide: API_URL, useValue: 'FAKE_URL' },
      { provide: IoClientService, useClass: IoClientServiceStub },
    ]
  }));

  beforeEach(() => {
    httpController = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    const service: GamesService = TestBed.get(GamesService);
    expect(service).toBeTruthy();
  });

  describe('#fetchGames()', () => {
    it('should call api endpoint', inject([GamesService], (service: GamesService) => {
      service.fetchGames().subscribe();
      httpController.expectOne('FAKE_URL/games');
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

  describe('#forceEndGame', () => {
    it('shoudl call io api endpoint');
  });
});
