import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { API_URL } from '@app/api-url';
import { StatisticsService } from './statistics.service';

describe(StatisticsService.name, () => {
  let service: StatisticsService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: API_URL, useValue: 'FAKE_URL' }],
    });
    service = TestBed.inject(StatisticsService);
    httpController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#fetchPlayedMapsCount()', () => {
    it('should call the endpoint', () => {
      service.fetchPlayedMapsCount().subscribe();
      httpController.expectOne('FAKE_URL/statistics/played-maps-count');
    });
  });

  describe('#fetchGameLaunchTimeSpans()', () => {
    it('should call the endpoint', () => {
      service.fetchGameLaunchTimeSpans().subscribe();
      httpController.expectOne('FAKE_URL/statistics/game-launch-time-spans');
    });
  });

  describe('#fetchGameLaunchesPerDay()', () => {
    it('should call the endpoint', () => {
      service.fetchGameLaunchesPerDay(new Date(2021, 11, 21)).subscribe();
      httpController.expectOne(
        'FAKE_URL/statistics/game-launches-per-day?since=2021-12-21',
      );
    });
  });
});
