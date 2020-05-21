import { TestBed } from '@angular/core/testing';
import { TwitchService } from './twitch.service';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { API_URL } from '@app/api-url';
import { provideMockStore } from '@ngrx/store/testing';
import { AuthService } from '@app/auth/auth.service';
import { WindowHelperService } from '@app/shared/window-helper.service';
import { of } from 'rxjs';
import { Socket } from '@app/io/socket';
import EventEmitter from 'eventemitter3';

class AuthServiceStub {
  reauth() { return of('FAKE_AUTH_TOKEN'); }
}

class WindowHelperServiceStub {
  openWindow(params: any) { }
}

describe('TwitchService', () => {
  let service: TwitchService;
  let httpContoller: HttpTestingController;
  let socket: Socket;

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
        { provide: Socket, useClass: EventEmitter },
      ],
    });

    service = TestBed.inject(TwitchService);
    httpContoller = TestBed.inject(HttpTestingController);
    socket = TestBed.inject(Socket);
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
