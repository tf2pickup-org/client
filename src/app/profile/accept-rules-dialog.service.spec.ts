import { TestBed } from '@angular/core/testing';

import { AcceptRulesDialogService } from './accept-rules-dialog.service';

describe('AcceptRulesDialogService', () => {
  let service: AcceptRulesDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AcceptRulesDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
