import { TestBed, inject } from '@angular/core/testing';
import { HallOfFameService } from './hall-of-fame.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { API_URL } from '@app/api-url';

describe('HallOfFameService', () => {
  let httpContoller: HttpTestingController;

  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule,
    ],
    providers: [
      { provide: API_URL, useValue: 'FAKE_URL' },
    ],
  }));

  beforeEach(() => httpContoller = TestBed.get(HttpTestingController));
  afterEach(() => httpContoller.verify());

  it('should be created', () => {
    const service: HallOfFameService = TestBed.get(HallOfFameService);
    expect(service).toBeTruthy();
  });

  describe('#fetchHallOfFames()', () => {
    it('should call the endpoint', inject([HallOfFameService], (service: HallOfFameService) => {
      service.fetchHallOfFames().subscribe();
      httpContoller.expectOne('FAKE_URL/hall-of-fame');
      expect().nothing();
    }));
  });
});
