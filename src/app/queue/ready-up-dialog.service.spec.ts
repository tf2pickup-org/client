import { Overlay } from '@angular/cdk/overlay';
import { TestBed } from '@angular/core/testing';
import { ReadyUpDialogService } from './ready-up-dialog.service';

describe('ReadyUpDialogService', () => {
  let service: ReadyUpDialogService;
  let overlayService: jasmine.SpyObj<Overlay>;

  beforeEach(() => {
    overlayService = jasmine.createSpyObj<Overlay>(Overlay.name, ['create']);
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: Overlay, useValue: overlayService },
      ],
    });
    service = TestBed.inject(ReadyUpDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
