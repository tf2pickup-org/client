import { TestBed } from '@angular/core/testing';

import { ReadyUpDialogService } from './ready-up-dialog.service';

describe('ReadyUpDialogService', () => {
  let service: ReadyUpDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReadyUpDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
