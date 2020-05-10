import { TestBed } from '@angular/core/testing';

import { WindowHelperService } from './window-helper.service';

describe('WindowHelperService', () => {
  let service: WindowHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WindowHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
