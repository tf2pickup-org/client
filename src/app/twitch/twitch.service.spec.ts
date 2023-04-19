import { TestBed } from '@angular/core/testing';
import { TwitchService } from './twitch.service';
import {
  HttpTestingController,
  HttpClientTestingModule,
} from '@angular/common/http/testing';
import { API_URL } from '@app/api-url';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { WindowHelperService } from '@app/shared/window-helper.service';
import { Socket } from '@app/io/socket';
import EventEmitter from 'eventemitter3';
import { MockProvider } from 'ng-mocks';

describe('TwitchService', () => {
  let service: TwitchService;
  let httpController: HttpTestingController;
  let socket: Socket;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: API_URL, useValue: 'FAKE_URL' },
        provideMockStore(),
        { provide: Socket, useClass: EventEmitter },
        MockProvider(WindowHelperService),
      ],
    });

    service = TestBed.inject(TwitchService);
    httpController = TestBed.inject(HttpTestingController);
    socket = TestBed.inject(Socket);
  });

  afterEach(() => httpController.verify());
  afterEach(() => TestBed.inject(MockStore)?.resetSelectors());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#fetchStreams()', () => {
    it('should call the endpoint', () => {
      service.fetchStreams().subscribe();
      httpController.expectOne('FAKE_URL/twitch/streams');
      expect().nothing();
    });
  });

  describe('#login()', () => {
    it('should open a new window', () => {
      const windowHelperService = TestBed.inject(
        WindowHelperService,
      ) as jasmine.SpyObj<WindowHelperService>;
      service.login();
      expect(windowHelperService.openWindow).toHaveBeenCalledWith(
        jasmine.objectContaining({
          url: 'FAKE_URL/twitch/auth',
        }),
      );
    });
  });

  describe('#disconnect()', () => {
    it('should call the API', () => {
      service.disconnect().subscribe();
      const request = httpController.expectOne(
        'FAKE_URL/twitch/disconnect',
      ).request;
      expect(request.method).toBe('PUT');
    });
  });
});
