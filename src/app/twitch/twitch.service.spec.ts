import { TestBed } from '@angular/core/testing';
import { TwitchService } from './twitch.service';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { API_URL } from '@app/api-url';
import { provideMockStore } from '@ngrx/store/testing';
import { AuthService } from '@app/auth/auth.service';
import { WindowHelperService } from '@app/shared/window-helper.service';
import { of } from 'rxjs';

class AuthServiceStub {
  reauth() { return of('FAKE_AUTH_TOKEN'); }
}

class WindowHelperServiceStub {
  openWindow(params: any) { }
}

describe('TwitchService', () => {
  let service: TwitchService;
  let httpContoller: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: [
        { provide: API_URL, useValue: 'FAKE_URL' },
        provideMockStore(),
        { provide: AuthService, useClass: AuthServiceStub },
        { provide: WindowHelperService, useClass: WindowHelperServiceStub },
      ],
    });

    service = TestBed.inject(TwitchService);
    httpContoller = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpContoller.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#fetchStreams()', () => {
    it('should call the endpoint', () => {
      service.fetchStreams().subscribe();
      httpContoller.expectOne('FAKE_URL/twitch/streams');
      expect().nothing();
    });
  });

  describe('#login()', () => {
    it('should open a new window', () => {
      const spy = spyOn(TestBed.inject(WindowHelperService), 'openWindow');
      service.login();
      expect(spy).toHaveBeenCalledWith(jasmine.objectContaining({
        url: 'FAKE_URL/twitch/auth?token=FAKE_AUTH_TOKEN',
      }));
    });
  });
});
