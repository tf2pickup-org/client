import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { API_URL } from '@app/api-url';
import { ConfigurationService } from './configuration.service';

describe('ConfigurationService', () => {
  let service: ConfigurationService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: API_URL, useValue: 'FAKE_URL' }],
    });
    service = TestBed.inject(ConfigurationService);
    httpController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#fetchValues()', () => {
    it('should query the api', () => {
      let result;
      service
        .fetchValues<[string]>('games.whitelist_id')
        .subscribe(r => (result = r));
      const request = httpController.expectOne(
        'FAKE_URL/configuration?keys=games.whitelist_id',
      );
      request.flush([
        {
          key: 'games.whitelist_id',
          value: 'etf2l_9v9',
          schema: { type: 'string' },
        },
      ]);
      expect(result).toEqual([
        {
          key: 'games.whitelist_id',
          value: 'etf2l_9v9',
          schema: { type: 'string' },
        },
      ]);
    });
  });

  describe('#storeValues()', () => {
    it('should query the api', () => {
      let result;
      service
        .storeValues<[string]>({
          key: 'games.whitelist_id',
          value: 'etf2l_6v6',
        })
        .subscribe(r => (result = r));
      const request = httpController.expectOne('FAKE_URL/configuration');
      expect(request.request.method).toBe('PUT');
      expect(request.request.body).toEqual([
        {
          key: 'games.whitelist_id',
          value: 'etf2l_6v6',
        },
      ]);
      request.flush([
        {
          key: 'games.whitelist_id',
          value: 'etf2l_6v6',
          schema: { type: 'string' },
        },
      ]);
      expect(result).toEqual([
        {
          key: 'games.whitelist_id',
          value: 'etf2l_6v6',
          schema: { type: 'string' },
        },
      ]);
    });
  });
});
