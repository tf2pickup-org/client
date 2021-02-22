import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { API_URL } from '@app/api-url';
import { ConfigurationService } from './configuration.service';

describe('ConfigurationService', () => {
  let service: ConfigurationService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: [
        { provide: API_URL, useValue: 'FAKE_URL' },
      ],
    });
    service = TestBed.inject(ConfigurationService);
    httpController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#fetchConfiguration()', () => {
    it('should query the API', () => {
      service.fetchConfiguration().subscribe();
      httpController.expectOne('FAKE_URL/configuration');
      expect().nothing();
    });
  });

  describe('#setConfiguration()', () => {
    it('should query the API', () => {
      service.setConfiguration({ whitelistId: 'etf2l_6v6' }).subscribe();
      const req = httpController.expectOne('FAKE_URL/configuration').request;
      expect(req.method).toBe('PUT');
      expect(req.body).toEqual({ whitelistId: 'etf2l_6v6' });
    });
  });

});
