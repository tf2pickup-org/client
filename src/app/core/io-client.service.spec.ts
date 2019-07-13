import { TestBed } from '@angular/core/testing';

import { IoClientService } from './io-client.service';

describe('IoClientService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IoClientService = TestBed.get(IoClientService);
    expect(service).toBeTruthy();
  });
});
