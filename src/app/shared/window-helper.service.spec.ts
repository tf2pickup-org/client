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

  describe('#openWindow()', () => {
    it('should attempt to open a window with the specified params', () => {
      const spy = spyOn(window, 'open');
      service.openWindow({ url: 'FAKE_URL', width: 100, height: 100 });
      expect(spy).toHaveBeenCalledWith('FAKE_URL', '', jasmine.any(String));
    });
  });
});
