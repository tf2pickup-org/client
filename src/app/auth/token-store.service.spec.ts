import { TestBed, inject } from '@angular/core/testing';
import { TokenStoreService } from './token-store.service';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';

class StorageServiceStub {
  get(key: string) { return 'FAKE_TOKEN'; }
  set(key: string) { }
  remove(key: string) { }
}

describe('TokenStoreService', () => {
  let storageService: StorageService;

  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      { provide: LOCAL_STORAGE, useClass: StorageServiceStub },
    ]
  }));

  beforeEach(() => {
    storageService = TestBed.get(LOCAL_STORAGE);
  });

  it('should be created', () => {
    const service: TokenStoreService = TestBed.get(TokenStoreService);
    expect(service).toBeTruthy();
  });

  describe('refreshToken', () => {
    it('should be retrieved from the store', inject([TokenStoreService], (service: TokenStoreService) => {
      const spy = spyOn(storageService, 'get');
      const _ = service.refreshToken;
      expect(spy).toHaveBeenCalledWith('refresh_token');
    }));

    it('should be stored in the store', inject([TokenStoreService], (service: TokenStoreService) => {
      const spy = spyOn(storageService, 'set');
      service.refreshToken = 'FAKE_TOKEN';
      expect(spy).toHaveBeenCalledWith('refresh_token', 'FAKE_TOKEN');
    }));
  });

  describe('authToken', () => {
    it('should be retrieved from the store', inject([TokenStoreService], (service: TokenStoreService) => {
      const spy = spyOn(storageService, 'get');
      const _ = service.authToken;
      expect(spy).toHaveBeenCalledWith('auth_token');
    }));

    it('should be stored in the store', inject([TokenStoreService], (service: TokenStoreService) => {
      const spy = spyOn(storageService, 'set');
      service.authToken = 'FAKE_TOKEN';
      expect(spy).toHaveBeenCalledWith('auth_token', 'FAKE_TOKEN');
    }));
  });
});
