import { TestBed, inject } from '@angular/core/testing';
import { ProfileService } from './profile.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { API_URL } from '@app/api-url';

describe('ProfileService', () => {
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

  it('should be created', () => {
    const service: ProfileService = TestBed.get(ProfileService);
    expect(service).toBeTruthy();
  });

  describe('#fetchProfile()', () => {
    it('should call the endpoint', inject([ProfileService], (service: ProfileService) => {
      service.fetchProfile().subscribe();
      httpController.expectOne('FAKE_URL/profile');
      expect().nothing();
    }));
  });

  describe('#acceptRules()', () => {
    it('should call the endpoint', inject([ProfileService], (service: ProfileService) => {
      service.acceptRules().subscribe();
      const req = httpController.expectOne('FAKE_URL/profile?accept_terms');
      expect(req.request.method).toBe('POST');
    }));
  });
});
