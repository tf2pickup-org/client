import { Overlay } from '@angular/cdk/overlay';
import { TestBed } from '@angular/core/testing';
import { ReadyUpService } from './ready-up.service';

describe('ReadyUpService', () => {
  let service: ReadyUpService;
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
    service = TestBed.inject(ReadyUpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
