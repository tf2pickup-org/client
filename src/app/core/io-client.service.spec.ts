import { TestBed } from '@angular/core/testing';
import { IoClientService } from './io-client.service';
import { AuthService } from '@app/auth/auth.service';
import { WS_URL } from '@app/ws-url';
import { provideMockStore } from '@ngrx/store/testing';

class AuthServiceStub {
  authenticated: false;
}

describe('IoClientService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      { provide: AuthService, useClass: AuthServiceStub },
      { provide: WS_URL, useValue: 'FAKE_WS' },
      provideMockStore(),
    ]
  }));

  it('should be created', () => {
    const service: IoClientService = TestBed.get(IoClientService);
    expect(service).toBeTruthy();
  });
});
