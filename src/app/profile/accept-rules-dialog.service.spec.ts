import { OverlayModule } from '@angular/cdk/overlay';
import { TestBed } from '@angular/core/testing';
import { AcceptRulesDialogService } from './accept-rules-dialog.service';

describe('AcceptRulesDialogService', () => {
  let service: AcceptRulesDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        OverlayModule,
      ],
    });
    service = TestBed.inject(AcceptRulesDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
