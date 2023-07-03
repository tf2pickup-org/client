import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { API_URL } from '@app/api-url';
import { ServemeTfService } from './serveme-tf.service';

describe(ServemeTfService.name, () => {
  let service: ServemeTfService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: API_URL, useValue: 'FAKE_URL' }],
    });
    service = TestBed.inject(ServemeTfService);
    http = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when the endpoint is enabled', () => {
    beforeEach(() => {
      const request = http.expectOne('FAKE_URL/serveme-tf');
      request.flush({
        isEnabled: true,
      });
    });

    it('should mark as enabled', () => {
      service.isEnabled.subscribe(enabled => expect(enabled).toBe(true));
    });

    describe('#fetchAllServers', () => {
      it('should query the API', () => {
        service.fetchAllServers().subscribe();
        const request = http.expectOne('FAKE_URL/serveme-tf/servers').request;
        expect(request.method).toBe('GET');
      });
    });
  });

  describe('when the endpoint is disabled', () => {
    beforeEach(() => {
      const request = http.expectOne('FAKE_URL/serveme-tf');
      request.flush({}, { status: 404, statusText: 'Not Found' });
    });

    it('should mark as disabled', () => {
      service.isEnabled.subscribe(enabled => expect(enabled).toBe(false));
    });
  });
});
