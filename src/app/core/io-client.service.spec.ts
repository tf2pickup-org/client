import { TestBed } from '@angular/core/testing';
import { IoClientService } from './io-client.service';
import { AuthService } from '@app/auth/auth.service';
import { WS_URL } from '@app/ws-url';
import { provideMockStore } from '@ngrx/store/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { API_URL } from '@app/api-url';
import { TokenStoreService } from '@app/auth/token-store.service';

class AuthServiceStub {
  authenticated: false;
}

class TokenStoreServiceStub {
  wsToken = 'FAKE_WS_TOKEN';
}

describe('IoClientService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [ HttpClientTestingModule ],
    providers: [
      { provide: AuthService, useClass: AuthServiceStub },
      { provide: TokenStoreService, useClass: TokenStoreServiceStub },
      { provide: WS_URL, useValue: 'FAKE_WS' },
      { provide: API_URL, useValue: 'FAKE_URL' },
      provideMockStore(),
    ]
  }));

  it('should be created', () => {
    const service: IoClientService = TestBed.get(IoClientService);
    expect(service).toBeTruthy();
  });
});
