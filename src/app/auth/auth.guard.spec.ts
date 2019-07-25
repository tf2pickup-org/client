import { TestBed, async, inject } from '@angular/core/testing';
import { AuthGuard } from './auth.guard';
import { API_URL } from '@app/api-url';

describe('AuthGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: API_URL, useValue: 'FAKE_URL' },
      ]
    });
  });

  it('should ...', inject([AuthGuard], (guard: AuthGuard) => {
    expect(guard).toBeTruthy();
  }));
});
