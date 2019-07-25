import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { API_URL } from '@app/api-url';

describe('AuthService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      { provide: API_URL, useValue: 'FAKE_URL' },
    ]
  }));

  it('should be created', () => {
    const service: AuthService = TestBed.get(AuthService);
    expect(service).toBeTruthy();
  });
});
